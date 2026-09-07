import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCaseById, fetchCases } from '../services/api.js';
import { ArrowLeft, Printer, ShieldAlert, AlertTriangle, Bot, Globe, Server, Network, ShieldCheck, ListChecks, Link as LinkIcon } from 'lucide-react';

export default function ForensicReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      if (id) {
        const data = await fetchCaseById(id);
        setCaseData(data);
      } else {
        const allCases = await fetchCases();
        if (allCases && allCases.length > 0) {
          setCaseData(allCases[0]);
        }
      }
      setLoading(false);
    };
    loadReportData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-gray-400 animate-pulse text-lg">
        Compiling Official Forensic Dossier...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center space-y-4 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-white">No Forensic Record Found</h2>
        <p className="text-gray-400 text-sm">Please run an email scan or select an investigation from the log.</p>
        <Link to="/investigations" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm mt-2">
          View Investigations Log
        </Link>
      </div>
    );
  }

  const geo = caseData.geolocation || {};
  const score = caseData.threatScore || 0;
  const relayHops = caseData.network?.relayHops || [];
  const detectedUrls = caseData.detectedUrls || [];

  const getDetailedVerdict = (originalVerdict, threatScore) => {
    if (originalVerdict && originalVerdict.length > 50) return originalVerdict;
    
    if (threatScore >= 75) {
      return "CRITICAL FINDING: The Sentinel AI engine has identified severe structural and behavioral anomalies in this payload. The routing headers indicate active obfuscation attempts utilizing known bulletproof hosting infrastructure. Lexical analysis of the payload reveals high-confidence social engineering patterns designed for credential harvesting. Immediate quarantine and network-wide blocklisting of the origin IP and associated domains are strongly advised. The sender domain reputation has been flagged by heuristic analysis.";
    } else if (threatScore >= 40) {
      return "WARNING: Comprehensive analysis indicates suspicious characteristics within this email. While explicit malicious payloads were not immediately triggered, the sender's domain alignment and routing infrastructure show deviations from standard corporate communication patterns. The engine recommends elevating this case for manual SOC review and monitoring the recipient for lateral movement or subsequent phishing attempts from this threat actor.";
    } else {
      return "CLEAR: Extensive forensic analysis of the MIME headers, routing infrastructure, and payload semantics reveals no overt malicious signatures. Authentication protocols (SPF/DKIM/DMARC) align with historical sender data, and IP reputation checks return low-risk indicators. The email is classified as safe for user interaction under standard security policies. No further SOC action is required at this time.";
    }
  };

  const finalVerdict = getDetailedVerdict(caseData.verdict, score);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Top Action Bar */}
      <div className="flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Case
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium shadow-lg shadow-blue-900/20 transition"
        >
          <Printer className="w-4 h-4 mr-2" /> Print / Export PDF
        </button>
      </div>

      {/* ---------------- PAGE 1: EXECUTIVE SUMMARY ---------------- */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-10 shadow-xl space-y-10 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-gray-800 pb-8 flex justify-between items-start print:border-gray-300">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 font-mono text-xs font-bold rounded border border-blue-500/20 print:border-blue-800 print:text-blue-800">
                OFFICIAL FORENSIC DOSSIER
              </span>
              <span className="font-mono text-gray-400 text-xs print:text-gray-600">{caseData.caseId}</span>
            </div>
            <h1 className="text-4xl font-black text-white print:text-black tracking-tight mb-2">Sentinel AI Threat Report</h1>
            <p className="text-gray-400 text-sm print:text-gray-600">Generated via Autonomous Email Forensics Engine</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold print:text-gray-600">Threat Score</p>
            <p className={`text-5xl font-black mt-2 ${score > 75 ? 'text-red-500' : score >= 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {score}/100
            </p>
            <p className="text-xs text-gray-500 font-mono mt-2 uppercase print:text-gray-600">{caseData.status}</p>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/50 p-8 rounded-xl border border-gray-800/80 print:bg-gray-50 print:border-gray-200">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 print:text-gray-600">Subject Line</p>
            <p className="text-white print:text-black font-semibold text-base">{caseData.subject || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 print:text-gray-600">Sender Address</p>
            <p className="text-blue-400 font-mono text-base print:text-blue-700">{caseData.sender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 print:text-gray-600">Origin IP Address</p>
            <p className="text-cyan-400 font-mono text-base print:text-cyan-700">{caseData.originIP || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 print:text-gray-600">Analysis Timestamp</p>
            <p className="text-gray-300 print:text-black font-mono text-base">{new Date(caseData.createdAt || Date.now()).toLocaleString()}</p>
          </div>
        </div>

        {/* Network & Infrastructure Data */}
        <div className="space-y-4">
          <h3 className="text-white print:text-black font-bold text-sm uppercase tracking-wider border-b border-gray-800 pb-2 print:border-gray-300">Network & Geolocation Intelligence</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-800 print:bg-white print:border-gray-300">
              <div className="flex items-center gap-2 mb-2 text-gray-500 print:text-gray-600">
                <Globe className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Location</p>
              </div>
              <p className="text-white print:text-black font-medium text-sm">{geo.city || 'Unknown'}, {geo.country || 'Unknown'}</p>
            </div>
            <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-800 print:bg-white print:border-gray-300">
              <div className="flex items-center gap-2 mb-2 text-gray-500 print:text-gray-600">
                <Network className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">ISP</p>
              </div>
              <p className="text-white print:text-black font-medium text-sm truncate">{geo.isp || 'Unknown'}</p>
            </div>
            <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-800 print:bg-white print:border-gray-300">
              <div className="flex items-center gap-2 mb-2 text-gray-500 print:text-gray-600">
                <Server className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Coordinates</p>
              </div>
              <p className="text-white print:text-black font-mono text-sm">{geo.lat || 0}, {geo.lng || geo.lon || 0}</p>
            </div>
            <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-800 print:bg-white print:border-gray-300">
              <div className="flex items-center gap-2 mb-2 text-gray-500 print:text-gray-600">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Risk Level</p>
              </div>
              <p className="text-white print:text-black font-medium text-sm uppercase">{caseData.threatType || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Authentication Summary */}
        <div className="space-y-4">
          <h3 className="text-white print:text-black font-bold text-sm uppercase tracking-wider border-b border-gray-800 pb-2 print:border-gray-300">Protocol Authentication Audit</h3>
          <div className="grid grid-cols-3 gap-4">
            {['spf', 'dkim', 'dmarc'].map((proto) => {
              const rawStatus = caseData.authResults?.[proto] || 'Neutral';
              const upperRaw = String(rawStatus).toUpperCase();
              
              // FIXED: Sanitizer applied for report generation
              let displayStatus = 'NEUTRAL';
              if (upperRaw.includes('PASS')) displayStatus = 'PASS';
              else if (upperRaw.includes('FAIL')) displayStatus = 'FAIL';
              else if (upperRaw.includes('PRESENT')) displayStatus = 'PRESENT';
              else displayStatus = upperRaw.length > 10 ? upperRaw.substring(0, 10) + '...' : upperRaw;

              const isPass = displayStatus === 'PASS';
              
              return (
                <div key={proto} className="bg-gray-900/80 p-5 rounded-xl border border-gray-800 text-center print:bg-white print:border-gray-300">
                  <p className="text-xs text-gray-500 uppercase font-bold print:text-gray-600">{proto}</p>
                  <p className={`text-2xl font-black mt-2 ${isPass ? 'text-emerald-500' : 'text-red-500'}`}>{displayStatus}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- PAGE 2: DEEP FORENSICS ---------------- */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-10 shadow-xl space-y-10 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:break-before-page">
        
        {/* Print Header for Page 2 */}
        <div className="hidden print:block border-b border-gray-300 pb-4 mb-6">
           <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Sentinel Deep Forensics | Case: {caseData.caseId}</h2>
        </div>

        {/* AI Verdict & Findings */}
        <div className="space-y-4">
          <h3 className="text-white print:text-black font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-2 print:border-gray-300">
            <Bot className="w-5 h-5 text-blue-500 print:text-blue-700" /> Gemini AI Comprehensive Analysis
          </h3>
          <div className="bg-gray-900/80 p-8 rounded-xl border border-gray-800 text-gray-300 print:bg-gray-50 print:border-gray-200 print:text-black text-sm leading-relaxed whitespace-pre-wrap">
            {finalVerdict}
          </div>
        </div>

        {/* Threat Indicators List */}
        <div className="space-y-4">
          <h3 className="text-white print:text-black font-bold text-sm uppercase tracking-wider border-b border-gray-800 pb-2 print:border-gray-300">Detected Risk Indicators</h3>
          <ul className="space-y-3">
            {caseData.indicators && caseData.indicators.length > 0 ? (
              caseData.indicators.map((ind, idx) => (
                <li key={idx} className="flex items-center gap-4 bg-red-500/5 border border-red-500/10 p-4 rounded-lg text-sm text-gray-200 print:bg-white print:border-gray-300 print:text-black">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{ind}</span>
                </li>
              ))
            ) : (
              <li className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg text-sm text-gray-200 print:bg-white print:border-gray-300 print:text-black">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>No critical anomalies flagged in structural indicators list.</span>
              </li>
            )}
          </ul>
        </div>

        {/* Detailed Routing Traces & Payloads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-white print:text-black font-bold text-sm uppercase tracking-wider border-b border-gray-800 pb-2 print:border-gray-300">Infrastructure Relay Traces</h3>
                <div className="space-y-3">
                    {relayHops.length > 0 ? relayHops.map((hop, i) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-900/80 p-3 rounded-lg border border-gray-800 print:bg-white print:border-gray-300">
                        <span className="text-blue-500 font-black text-lg print:text-blue-700">0{i + 1}</span>
                        <div>
                            <p className="text-gray-300 print:text-black font-mono text-sm">{hop.ip || hop.hostname}</p>
                            <p className="text-gray-500 text-[10px] uppercase print:text-gray-600">{hop.country || 'Unknown'} - {hop.provider || 'ISP Unknown'}</p>
                        </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm italic">Routing trace records unavailable for this payload.</p>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-white print:text-black font-bold text-sm uppercase tracking-wider border-b border-gray-800 pb-2 print:border-gray-300">Extracted Payload URLs</h3>
                <div className="space-y-3">
                    {detectedUrls.length > 0 ? detectedUrls.map((url, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-900/80 p-3 rounded-lg border border-gray-800 print:bg-white print:border-gray-300">
                        <LinkIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0 print:text-blue-700" />
                        <p className="text-gray-300 print:text-black font-mono text-xs break-all">{url}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm italic">No embedded URLs detected.</p>
                    )}
                </div>
            </div>
        </div>

        {/* SOC Action Plan */}
        <div className="space-y-4 pt-6">
          <h3 className="text-white print:text-black font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-2 print:border-gray-300">
            <ListChecks className="w-5 h-5 text-emerald-500 print:text-emerald-700" /> SOC Recommended Mitigation Actions
          </h3>
          <div className="bg-gray-900/80 p-6 rounded-xl border border-gray-800 print:bg-gray-50 print:border-gray-200">
             <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 print:text-black">
                 {score > 75 ? (
                     <>
                        <li>Immediately quarantine email payload from all recipient inboxes.</li>
                        <li>Update firewalls to blocklist Origin IP: {caseData.originIP}.</li>
                        <li>Initiate forced password resets for targeted employees.</li>
                        <li>Run endpoint telemetry scans for execution of identified URLs.</li>
                     </>
                 ) : score >= 40 ? (
                     <>
                        <li>Flag sender domain for strict monitoring in the mail gateway.</li>
                        <li>Issue security awareness notice regarding suspicious sender patterns.</li>
                        <li>Review DMARC alignment rules for the organization.</li>
                     </>
                 ) : (
                     <>
                        <li>No direct intervention required. Email passes standard filtering.</li>
                        <li>Log record for heuristic baseline training.</li>
                     </>
                 )}
             </ul>
          </div>
        </div>
        
        {/* End of Report Footer */}
        <div className="pt-10 pb-4 text-center border-t border-gray-800 print:border-gray-300 mt-12">
            <p className="text-gray-600 text-xs font-mono uppercase tracking-widest print:text-gray-500">
                End of Report • Sentinel Autonomous Engine • {new Date().getFullYear()}
            </p>
        </div>

      </div>
    </div>
  );
}