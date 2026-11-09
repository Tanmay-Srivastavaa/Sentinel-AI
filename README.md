# 🛡️ Sentinel AI - Intelligent Threat Defense

**Smart India Hackathon (SIH) 2026 Prototype**

Sentinel AI is a full-stack cybersecurity application designed to automate forensic email analysis. By parsing raw `.eml` files safely in memory, the system analyzes cryptographic headers, maps network infrastructure, and leverages the Gemini 3.5 Flash-Lite AI model to detect zero-day phishing attempts and social engineering payloads.

<img width="1917" height="867" alt="image" src="https://github.com/user-attachments/assets/efaec127-ff4e-46ab-9896-61bdf195cf19" />

## 🚀 Key Features
* **Memory-Safe File Ingestion:** Processes potentially malicious `.eml` payloads entirely in RAM to prevent disk execution.
* **Cryptographic Protocol Analysis:** Automated verification of SPF, DKIM, and DMARC alignment.
* **AI Threat Assessment:** Utilizes Gemini 3.5 Flash-Lite to analyze semantic payloads, generate a 0-100 threat score, and provide actionable SOC verdicts.
* **Network Infrastructure Tracing:** Maps origin IPs and relay hops to pinpoint geographic locations and potential spoofing origins.
* **Interactive Forensic Dashboard:** A dynamic React (Vite) frontend featuring print-ready reporting and an integrated, context-aware floating AI Assistant.

## 🏗️ System Architecture

```text
                      [ Raw Email File (.eml) ]
                                 |
                                 v
                 [ Memory-Safe Ingestion Engine ]
                     (Multer / Node.js Express)
                                 |
           +---------------------+---------------------+
           |                     |                     |
           v                     v                     v
 [ Header & Protocol ]   [ Gemini Semantic ]   [ URL Infrastructure ]
 [     Analysis      ]   [     Engine      ]   [       Tracer       ]
  (SPF/DKIM/DMARC)       (Payload context)     (Extracted Links)
           |                     |                     |
           +---------------------+---------------------+
                                 |
                                 v
               [ AI Threat Assessment & Scoring Engine ]
                                 |
                 +---------------+---------------+
                 |                               |
                 v                               v
    [ Geo-Location & Routing ]       [ Forensic Intelligence Dashboard ]
    [      Mapping Hub       ]       [        & PDF Dossier            ]
```

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **External APIs:** Google Gemini AI, IP-API

## 💻 Local Setup & Installation

**1. Clone the repository**
```bash
git clone [https://github.com/Tanmay-Srivastavaa/Sentinel-AI.git](https://github.com/Tanmay-Srivastavaa/Sentinel-AI.git)
cd Sentinel-AI
```

**2. Backend Setup**
```bash
cd sentinel-backend
npm install
```
*Create a `.env` file in the `sentinel-backend` directory based on the provided `.env.example` file and add your MongoDB URI and Gemini API key.*

**3. Frontend Setup**
Open a new terminal window:
```bash
cd sentinel-frontend
npm install
```

**4. Start the Application**
Run this in the backend terminal:
```bash
npm run dev
```
Run this in the frontend terminal:
```bash
npm run dev
```

## 👥 Team
* **Tanmay Srivastava** - Team Lead & Full-Stack Integration
* **Tejaswi Dubey** - Frontend Architecture & UI Implementation
* **Tanu Awasthi** - Backend Architecture & API Integration
* **Tanushree Shukla** - Frontend Development & Presentation Strategy
* **Ravi Shukla** - Frontend Engineering & Threat Research
* **Suyash Agnihotri** - UI/UX Design & Security Research

## 📄 Documentation
* See `Files/PRD.md` for the Product Requirements Document.
* See `Files/TRD.md` for the Technical Requirements Document.
* See `Files/Workflow.md` for operational flows.
