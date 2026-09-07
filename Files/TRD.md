# Technical Requirements Document (TRD)
**System Architecture:** Sentinel AI Pipeline  

## 1. Technology Stack
*   **Frontend (Client):** React.js, Vite, Tailwind CSS (v3), Recharts (Data Visualization), Lucide React (Icons).
*   **Backend (API Gateway):** Node.js, Express.js.
*   **Database (Persistence):** MongoDB, Mongoose ODM.
*   **Core Libraries:** `mailparser` (MIME parsing), `dns` (Network resolution), `multer` (Memory storage payload handling), `crypto` (Hashing).
*   **AI Engine:** Google Gemini API (Primary: Gemini 3.6/3.7-Flash, Fallback: 3.5-Flash-Lite).

## 2. System Architecture Components
*   **Client Interface:** Renders dynamic Dark/Light mode UI. Sends `FormData` payload via Axios to API Gateway.
*   **API Gateway (Node.js):** Listens on Port 5000. Handles routing, rate-limiting, and payload sanitization.
*   **Forensic Parsers:** Dissects MIME boundaries, extracts cryptographic signatures (SPF/DKIM/DMARC), and isolates attachments/URLs.
*   **Enrichment Services:** 
    *   *Geo-IP Service:* Resolves origin IPs to physical geolocation and ISP/ASN.
    *   *Threat Intel Service:* Evaluates URLs against known malicious patterns.
*   **Semantic AI Engine:** Prompts Gemini with parsed email body/headers for linguistic and behavioral intent analysis.
*   **MongoDB Cluster:** Stores final master reports containing metadata, IOCs, verdicts, and generated Case IDs (e.g., `STN-XXXX`).

## 3. Fault Tolerance & Resilience
*   **API Fallback Cascade:** If Gemini 3.7-Flash experiences a 503 error, the system automatically degrades gracefully to 3.5-Flash-Lite.
*   **Retry Mechanisms:** Exponential backoff implemented for third-party geographic and network resolution lookups.