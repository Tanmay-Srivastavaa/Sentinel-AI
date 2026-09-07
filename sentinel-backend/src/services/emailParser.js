import { simpleParser } from 'mailparser';

// Helper to verify if an IP is public (ignores local/private subnets)
const isPublicIP = (ip) => {
    if (!ip) return false;
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return false;

    return !(
        parts[0] === 10 ||
        parts[0] === 127 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        parts[0] === 0
    );
};

export const parseEmailFile = async (fileBuffer) => {
    const parsed = await simpleParser(fileBuffer);

    const spfStatus = parsed.headers.get('received-spf') || "None";
    const dkimStatus = parsed.headers.get('dkim-signature') ? "Present" : "Failed/Missing";

    // 1. Envelope & Spoofing Correlation
    const fromAddress = parsed.from?.value[0]?.address || "Unknown Sender";
    const replyToAddress = parsed.replyTo?.value[0]?.address || fromAddress;
    const returnPath = parsed.headers.get('return-path')?.value || fromAddress;

    const isSpoofSuspected = (fromAddress !== replyToAddress && replyToAddress !== "Unknown Sender");

    // 2. Multi-Tier IP Extraction
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
    let originIP = "Unknown";
    let ipSource = "None";

    const clientHeader = parsed.headers.get('x-originating-ip') || 
                         parsed.headers.get('x-sender-ip') || 
                         parsed.headers.get('x-client-ip');

    if (clientHeader) {
        const match = clientHeader.match(ipRegex);
        if (match && isPublicIP(match[0])) {
            originIP = match[0];
            ipSource = "Client-Leaked Header (X-Originating-IP)";
        }
    }

    if (originIP === "Unknown" && typeof spfStatus === 'string') {
        const spfMatches = spfStatus.match(ipRegex);
        if (spfMatches) {
            const validSpfIP = spfMatches.find(isPublicIP);
            if (validSpfIP) {
                originIP = validSpfIP;
                ipSource = "Authorized Relay Node (SPF)";
            }
        }
    }

    if (originIP === "Unknown") {
        const receivedHeaders = parsed.headers.get('received');
        const receivedStr = Array.isArray(receivedHeaders) ? receivedHeaders.join(' ') : (receivedHeaders || "");
        const allIps = receivedStr.match(ipRegex) || [];
        const publicIps = allIps.filter(isPublicIP);

        if (publicIps.length > 0) {
            originIP = publicIps[publicIps.length - 1];
            ipSource = "Chronological Received Hop";
        }
    }

    // 3. Body Text Extraction
    let extractedText = parsed.text;
    if (!extractedText && parsed.html) {
        extractedText = parsed.html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    }

    // 4. Extract Embedded URLs
    const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
    const combinedContent = `${parsed.text || ''} ${parsed.html || ''}`;
    const detectedUrls = [...new Set(combinedContent.match(urlRegex) || [])];

    return {
        subject: parsed.subject || "No Subject",
        sender: fromAddress,
        replyTo: replyToAddress,
        returnPath: returnPath,
        isSpoofSuspected,
        date: parsed.date,
        auth: { spf: spfStatus, dkim: dkimStatus },
        network: { originIP, ipSource },
        bodyText: extractedText || "No readable content found",
        detectedUrls
    };
};