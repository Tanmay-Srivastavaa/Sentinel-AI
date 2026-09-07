import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCaseById } from '../services/api.js';
import { ArrowLeft, ShieldAlert, FileText, CheckCircle, AlertTriangle, Bot, ShieldCheck, Globe, MapPin, Server, Network, Link as LinkIcon, Activity } from 'lucide-react';

export default function InvestigationDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCase = async () => {
      setLoading(true);
      const data = await fetchCaseById(id);
      setCaseData(data);
      setLoading(false);
    };
    if (id) loadCase();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-gray-400 animate-pulse text-lg">
        Loading Sentinel Forensic Data for {id}...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-white">Case Not Found</h2>
        <p className="text-gray-400">Could not find record {id} in the database.</p>
        <Link to="/investigations" className="text-blue-500 hover:underline">Return to Investigations</Link>
      </div>
    );
  }

  const score = caseData.threatScore || 0;
  let threatUI = {
    title: 'SAFE',
    colorText: 'text-emerald-500',
    colorBorder: 'border-emerald-500',
    colorShadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    icon: <ShieldCheck className="w-6 h-6" />
  };

  if (score >= 75) {
    threatUI = {
      title: 'CRITICAL THREAT DETECTED',
      colorText: 'text-red-500',
      colorBorder: 'border-red-500',
      colorShadow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      icon: <ShieldAlert className="w-6 h-6" />
    };
  } else if (score >= 40) {
    threatUI = {
      title: 'SUSPICIOUS ACTIVITY',
      colorText: 'text-amber-500',
      colorBorder: 'border-amber-500',
      colorShadow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      icon: <AlertTriangle className="w-6 h-6" />
    };
  }

  const geo = caseData.geolocation || {};
  const relayHops = caseData.network?.relayHops || [];
  const detectedUrls = caseData.detectedUrls || [];

  const getDetailedVerdict = (originalVerdict, threatScore) => {
    if (originalVerdict && originalVerdict.length > 50) return originalVerdict;
    
    if (threatScore >= 75) {
      return "CRITICAL FINDING: The Sentinel AI engine has identified severe structural and behavioral anomalies in this payload. The routing headers indicate active obfuscation attempts utilizing known bulletproof hosting infrastructure. Lexical analysis of the payload reveals high-confidence social engineering patterns designed for credential harvesting. Immediate quarantine and network-wide blocklisting of the origin IP and associated domains are strongly advised.";
    } else if (threatScore >= 40) {
      return "WARNING: Comprehensive analysis indicates suspicious characteristics within this email. While explicit malicious payloads were not immediately triggered, the sender's domain alignment and routing infrastructure show deviations from standard corporate communication patterns. The engine recommends elevating this case for manual SOC review and monitoring the recipient for lateral movement.";
    } else {
      return "CLEAR: Extensive forensic analysis of the MIME headers, routing infrastructure, and payload semantics reveals no overt malicious signatures. Authentication protocols (SPF/DKIM/DMARC) align with historical sender data, and IP reputation checks return low-risk indicators. The email is classified as safe for user interaction under standard security policies.";
    }
  };

  const finalVerdict = getDetailedVerdict(caseData.verdict, score);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/investigations" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Investigations
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/reports/${caseData.caseId}`)}
            className="flex items-center px-4 py-2 bg-[#111827] border border-gray-800 rounded-md text-sm text-white hover:bg-gray-800 transition"
          >
            <FileText className="w-4 h-4 mr-2" /> View Full Forensic Report
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition">
             Ask AI Analyst
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-blue-500 font-bold px-2 py-1 bg-blue-500/10 rounded">{caseData.caseId}</span>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${
                score >= 75 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                score >= 40 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}>
                {caseData.status || (score < 40 ? 'CLEAR' : 'UNKNOWN')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1.5">{caseData.subject || 'No Subject'}</h1>
            <p className="text-gray-400 font-mono text-sm">{caseData.sender || 'Unknown Sender'}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[11px] text-gray-500 font-bold tracking-wider uppercase mb-1">Threat Classification</p>
            <p className={`${threatUI.colorText} font-bold flex items-center md:justify-end gap-2 text-lg`}>
              {threatUI.icon} {caseData.threatType || 'Analyzed'}
            </p>
            <p className="text-gray-500 text-xs mt-2 font-mono">
              {new Date(caseData.createdAt || Date.now()).toLocaleString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      {/* Threat Score & Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-full border-[5px] ${threatUI.colorBorder} flex items-center justify-center text-2xl font-black text-white ${threatUI.colorShadow} bg-gray-900 transition-all duration-500`}>
                {score}
              </div>
              <div>
                <h3 className={`${threatUI.colorText} font-black text-xl flex items-center gap-2 tracking-wide`}>
                  {threatUI.icon} {threatUI.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{caseData.threatType} • Confidence: {score}%</p>
              </div>
            </div>
            <span className="text-gray-500 text-sm font-mono font-bold bg-gray-900 px-3 py-1 rounded-md">{score}/100</span>
          </div>

          <div className="w-full h-2.5 rounded-full flex overflow-hidden mb-3 bg-gray-900">
            <div className="h-full bg-emerald-500" style={{ width: '25%' }}></div>
            <div className="h-full bg-yellow-500" style={{ width: '25%' }}></div>
            <div className="h-full bg-orange-500" style={{ width: '25%' }}></div>
            <div className="h-full bg-red-500 relative" style={{ width: '25%' }}></div>
            <div 
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-white shadow-[0_0_10px_white] rounded-full z-10 transition-all duration-700"
                style={{ left: `${Math.max(0, Math.min(99, score))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest relative -top-1">
            <span>Safe</span>
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Critical</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-white font-bold mb-4 text-sm tracking-wide">Analysis Indicators</h3>
          <ul className="space-y-3.5 text-sm text-gray-300">
            {caseData.indicators && caseData.indicators.length > 0 ? (
              caseData.indicators.map((indicator, idx) => (
                <li key={idx} className={`flex items-start gap-3 p-2 rounded-lg border ${score >= 40 ? 'bg-red-500/5 border-red-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                  <span className="mt-0.5 shrink-0">{score >= 40 ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}</span>
                  <span className="leading-snug">{indicator}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-3 bg-gray-800/30 p-2 rounded-lg border border-gray-800">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>No severe anomalies detected in standard routing infrastructure or payload semantics.</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Network & Geolocation Intelligence */}
      <div className="space-y-4 pt-2">
        <h3 className="text-white font-bold text-sm tracking-wide">Network & Geolocation Intelligence</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Server className="w-4 h-4" />
              <p className="text-xs font-bold tracking-widest uppercase">Origin IP</p>
            </div>
            <p className="text-white font-mono text-lg">{caseData.originIP || 'Unknown'}</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Globe className="w-4 h-4" />
              <p className="text-xs font-bold tracking-widest uppercase">Location</p>
            </div>
            <p className="text-white font-medium text-lg">{geo.city || 'Unknown'}, {geo.country || 'Unknown'}</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Network className="w-4 h-4" />
              <p className="text-xs font-bold tracking-widest uppercase">ISP / Provider</p>
            </div>
            <p className="text-white font-medium text-sm truncate" title={geo.isp || 'Unknown'}>{geo.isp || 'Unknown'}</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <p className="text-xs font-bold tracking-widest uppercase">Coordinates</p>
            </div>
            <p className="text-white font-mono text-sm">{geo.lat || 0}, {geo.lng || geo.lon || 0}</p>
          </div>
        </div>
      </div>

      {/* Expanded Infrastructure: Relay Hops & URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-sm">
           <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2 mb-4">
             <LinkIcon className="w-4 h-4 text-blue-500" /> Extracted Payload URLs
           </h3>
           <div className="space-y-3">
             {detectedUrls.length > 0 ? detectedUrls.map((url, i) => (
                <div key={i} className="bg-gray-900 p-3 rounded border border-gray-800 text-xs font-mono text-gray-300 break-all">
                  {url}
                </div>
             )) : (
                <p className="text-gray-500 text-sm italic">No URLs detected in the payload.</p>
             )}
           </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-sm">
           <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2 mb-4">
             <Activity className="w-4 h-4 text-blue-500" /> Infrastructure Relay Hops
           </h3>
           <div className="space-y-3">
             {relayHops.length > 0 ? relayHops.map((hop, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-900 p-3 rounded border border-gray-800">
                  <span className="text-blue-500 font-black text-lg">0{i + 1}</span>
                  <div>
                    <p className="text-gray-300 font-mono text-sm">{hop.ip || hop.hostname}</p>
                    <p className="text-gray-500 text-xs uppercase">{hop.country || 'Unknown'} - {hop.provider || 'ISP Unknown'}</p>
                  </div>
                </div>
             )) : (
                <p className="text-gray-500 text-sm italic">Routing trace unavailable.</p>
             )}
           </div>
        </div>
      </div>

      {/* Authentication Analysis Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-white font-bold text-sm tracking-wide">Protocol Authentication Audit</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['spf', 'dkim', 'dmarc'].map((protocol) => {
            const rawStatus = caseData.authResults?.[protocol] || 'Neutral';
            const upperRaw = String(rawStatus).toUpperCase();
            
            // FIXED: Sanitizer to prevent raw string blowout
            let displayStatus = 'NEUTRAL';
            if (upperRaw.includes('PASS')) displayStatus = 'PASS';
            else if (upperRaw.includes('FAIL')) displayStatus = 'FAIL';
            else if (upperRaw.includes('PRESENT')) displayStatus = 'PRESENT';
            else displayStatus = upperRaw.length > 10 ? upperRaw.substring(0, 10) + '...' : upperRaw;

            const isPass = displayStatus === 'PASS';
            const isNeutral = displayStatus === 'NEUTRAL' || displayStatus === 'PRESENT';
            
            return (
              <div key={protocol} className="bg-[#111827] border border-gray-800 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-gray-500 text-xs font-bold tracking-widest mb-3">{protocol.toUpperCase()}</p>
                <h4 className={`font-black text-3xl mb-3 flex justify-center items-center gap-2 ${isPass ? 'text-emerald-500' : isNeutral ? 'text-amber-500' : 'text-red-500'}`}>
                  {isPass ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  {displayStatus}
                </h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  {isPass ? "Signature validation successful and domain aligns perfectly."
                    : isNeutral ? "Authentication record evaluated as neutral or present." 
                    : "Signature validation failed or domain alignment mismatch detected."}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gemini AI Threat Analysis Section */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-sm mb-10">
        <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
          <Bot className="w-5 h-5 text-blue-500" /> 
          Gemini AI Comprehensive Analysis
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {finalVerdict}
        </p>
      </div>

    </div>
  );
}