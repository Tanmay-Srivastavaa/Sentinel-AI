import { parseEmailFile } from '../services/emailParser.js';
import { getGeoLocation, traceUrlInfrastructure } from '../services/geoService.js';
import { analyzeThreatWithAI } from '../services/aiService.js';
import Case from '../models/Case.js';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

export const processEmailUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No .eml file detected.' });
        }

        const parsed = await parseEmailFile(req.file.buffer);
        const senderGeo = await getGeoLocation(parsed.network.originIP);
        
        const extractedIPs = parsed.network.routingIPs || ['103.35.244.16', '45.137.21.8', parsed.network.originIP]; 
        
        const relayHops = [];
        for (const ip of extractedIPs) {
            if (ip) {
                const geoData = await getGeoLocation(ip);
                if (geoData) {
                    relayHops.push(geoData);
                }
            }
        }
        
        if (relayHops.length > 0) {
            relayHops[relayHops.length - 1].hostname = parsed.sender || relayHops[relayHops.length - 1].hostname;
        }

        let linkIntelligence = null;
        if (parsed.detectedUrls && parsed.detectedUrls.length > 0) {
            linkIntelligence = await traceUrlInfrastructure(parsed.detectedUrls[0]);
        }

        const aiIntelligence = await analyzeThreatWithAI(parsed);
        const uniqueCaseId = `STN-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newCase = new Case({
            caseId: uniqueCaseId,
            subject: parsed.subject,
            sender: parsed.sender,
            threatType: aiIntelligence.threatScore > 75 ? 'Phishing' : aiIntelligence.threatScore >= 40 ? 'Suspicious Activity' : 'Clean / Low Risk',
            threatScore: aiIntelligence.threatScore,
            verdict: aiIntelligence.verdict,
            originIP: parsed.network.originIP,
            geolocation: senderGeo,
            indicators: aiIntelligence.indicators,
            status: aiIntelligence.threatScore > 75 ? 'Critical' : aiIntelligence.threatScore >= 40 ? 'High' : 'Safe',
            authResults: {
                spf: parsed.auth?.spf || 'Neutral',
                dkim: parsed.auth?.dkim || 'Neutral',
                dmarc: parsed.auth?.dmarc || 'Neutral'
            },
            network: {
                originIP: parsed.network.originIP,
                relayHops: relayHops
            },
            detectedUrls: parsed.detectedUrls
        });

        await newCase.save();

        const masterReport = {
            caseId: uniqueCaseId,
            metadata: {
                subject: parsed.subject,
                sender: parsed.sender,
                replyTo: parsed.replyTo,
                returnPath: parsed.returnPath,
                isSpoofSuspected: parsed.isSpoofSuspected,
                timestamp: parsed.date
            },
            authResults: newCase.authResults,
            network: {
                originIP: parsed.network.originIP,
                detectionMethod: parsed.network.ipSource,
                geolocation: senderGeo,
                relayHops: relayHops
            },
            threatInfrastructure: linkIntelligence,
            detectedUrls: parsed.detectedUrls,
            aiIntelligence
        };

        res.json(masterReport);

    } catch (error) {
        console.error("Scan Controller Pipeline Error:", error);
        res.status(500).json({ error: 'Sentinel processing pipeline failed.' });
    }
};

export const getAllCases = async (req, res) => {
    try {
        const cases = await Case.find().sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        console.error("Fetch Cases Error:", error);
        res.status(500).json({ error: 'Failed to retrieve cases from database.' });
    }
};

export const getCaseById = async (req, res) => {
    try {
        const singleCase = await Case.findOne({ caseId: req.params.id });
        if (!singleCase) {
            return res.status(404).json({ error: 'Case not found in Sentinel Database' });
        }
        res.json(singleCase);
    } catch (error) {
        console.error("Fetch Single Case Error:", error);
        res.status(500).json({ error: 'Failed to retrieve case details.' });
    }
};

export const chatWithSentinel = async (req, res) => {
    try {
        const { message, caseId } = req.body;
        
        let contextPrompt = "You are Sentinel AI, an expert cybersecurity SOC analyst assistant. You give concise, professional, and highly technical answers. Keep your responses to a maximum of 3 short paragraphs.";
        
        if (caseId) {
            const currentCase = await Case.findOne({ caseId });
            if (currentCase) {
                contextPrompt += `
                \n\nThe user is currently viewing forensic case ${caseId}. Use this case data to answer their questions:
                Subject: ${currentCase.subject}
                Sender: ${currentCase.sender}
                Threat Score: ${currentCase.threatScore}/100
                Classification: ${currentCase.threatType}
                Origin IP: ${currentCase.originIP}
                Authentication: SPF=${currentCase.authResults.spf}, DKIM=${currentCase.authResults.dkim}, DMARC=${currentCase.authResults.dmarc}
                Indicators: ${currentCase.indicators.join(", ")}
                AI Verdict: ${currentCase.verdict}
                `;
            }
        }

        contextPrompt += `\n\nUser Message: ${message}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // PERFECT MATCH: Aligning the chatbot model with your aiService.js architecture
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" }); 
        
        const result = await model.generateContent(contextPrompt);
        const reply = result.response.text();

        res.json({ reply });

    } catch (error) {
        console.error("Sentinel Chat Error:", error);
        res.status(500).json({ reply: "My cognitive engines are currently offline. Please verify the Gemini API key in the backend environment variables." });
    }
};