# Sentinel AI - Threat Processing Workflow

1.  **Analyst Input:** SOC Analyst uploads a raw `.eml` file via the Frontend Drag-and-Drop Interface.
2.  **API Gateway:** Node.js Backend receives the multipart/form-data payload via Multer (stored temporarily in RAM).
3.  **Data Extraction (mailparser):** System strips the email into three components: Headers (Routing), Body (Content), and Attachments/URLs (Payload).
4.  **Parallel Execution Pipeline:**
    *   *Branch A (Cryptographic):* Validate SPF, DKIM, and DMARC alignment.
    *   *Branch B (Infrastructure):* Extract Origin IP -> Perform DNS/ASN Lookup -> Map Geolocation.
    *   *Branch C (Payload):* Defang embedded URLs and extract Domains/Emails for IOC generation.
5.  **AI Semantic Analysis:** Parsed content is pushed to the Gemini LLM Engine to detect social engineering urgency, BEC intent, and language anomalies.
6.  **Scoring & Verdict Generation:** System aggregates Branch A, B, C, and AI data to calculate a final Threat Score (0-100) and severity classification.
7.  **Data Persistence:** The Master Threat Payload is mapped to a unique Case ID and permanently stored in the MongoDB Database.
8.  **Client Render:** Backend returns the JSON response. Frontend Dashboard visually renders the Infrastructure Map, IOC Correlation Graph, and updates the Investigations Table.