import { GoogleGenerativeAI } from '@google/generative-ai';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeThreatWithAI = async (emailData, maxRetries = 3) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const prompt = `
            Act as an enterprise cyber threat forensic analyst. Analyze this email payload for phishing, social engineering, credential harvesting, or spoofing vectors.

            Email Context:
            - Sender: ${emailData.sender}
            - Reply-To: ${emailData.replyTo}
            - Spoof Flag Detected: ${emailData.isSpoofSuspected}
            - Embedded Links: ${JSON.stringify(emailData.detectedUrls.slice(0, 5))}
            - Content: ${emailData.bodyText.substring(0, 1500)}

            Return strictly a JSON object with this schema:
            {
                "threatScore": (number 0-100),
                "verdict": "(Safe, Suspicious, or Critical)",
                "reasoning": "(Concise 1-2 sentence forensic explanation)",
                "indicators": ["(List of key red flags, suspicious terms, or mismatches)"]
            }
        `;

        // The Cascade Array: Try the newest flash model first, fallback to the ultra-reliable Lite model
       const targetModels = ["gemini-3.5-flash-lite", "gemini-3.7-flash"];
        for (const modelName of targetModels) {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: { responseMimeType: "application/json" }
                    });

                    const result = await model.generateContent(prompt);
                    return JSON.parse(result.response.text());
                } catch (apiError) {
                    if (apiError.message.includes('503') && attempt < maxRetries) {
                        console.warn(`[⚠️ ${modelName} Busy] Attempt ${attempt} failed. Retrying...`);
                        await delay(attempt * 1500); 
                        continue;
                    } else if (apiError.message.includes('503')) {
                        console.warn(`[🔄 Switching Models] ${modelName} is completely blocked. Cascading to fallback...`);
                        break; // Break the retry loop to immediately try the next model in the array
                    }
                    throw apiError; 
                }
            }
        }

        // If the engine exhausts every model and every retry
        throw new Error("All Gemini routing endpoints are currently overloaded.");

    } catch (error) {
        console.error("AI Forensic Analysis error:", error.message);
        return {
            threatScore: 0,
            verdict: "Unknown",
            reasoning: `AI Engine failure after cascade: ${error.message}`,
            indicators: []
        };
    }
};