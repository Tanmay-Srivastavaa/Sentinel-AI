# Product Requirements Document (PRD)
**Project Name:** Sentinel AI  
**Target:** Smart India Hackathon (SIH) 2026 
**Author/Team Lead:** Tanmay Srivastava - CS 3E - 2501220100256  

## 1. Product Overview
Sentinel AI is an automated, AI-driven Cyber Threat Intelligence (CTI) and forensic email analysis platform designed for Security Operations Centers (SOC). It ingests suspicious `.eml` payloads, performs cryptographic header validation, traces relay infrastructure, and utilizes Large Language Models (LLMs) to detect zero-day phishing, Business Email Compromise (BEC), and malware vectors.

## 2. Problem Statement
Tier-1 SOC analysts spend excessive time manually parsing email headers, cross-referencing IP blacklists, and reverse-engineering social engineering payloads. This manual triage creates a bottleneck, increasing the Mean Time to Respond (MTTR) to critical enterprise threats.

## 3. Core Features & Modules
*   **Email Analysis Engine:** Drag-and-drop `.eml` ingestion with automated extraction of headers, routing paths, and embedded URLs.
*   **Interactive Investigations Dashboard:** Real-time case management system mapping historical threats with assigned severity scores (Low to Critical).
*   **Threat Intelligence Correlation:** Node-based visual graph linking active Indicators of Compromise (IOCs) across IPs, domains, and global campaigns.
*   **Infrastructure Geolocation:** Global map visualization tracing intermediate SMTP relay hops and origin network ASNs.
*   **Floating AI Assistant:** Context-aware chatbot utilizing Gemini 3.6/3.7-Flash to assist analysts with real-time forensic queries.

## 4. User Personas
*   **Tier-1 SOC Analyst:** Uses the platform for rapid triage and verdict generation.
*   **Threat Hunter / Incident Responder:** Utilizes the Threat Intelligence correlation graphs to map advanced persistent threat (APT) campaigns.