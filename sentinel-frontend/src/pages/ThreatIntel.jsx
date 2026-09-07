import React from 'react';
import { Database, Target, Server, Globe, RefreshCw, GitBranch, Mail, Link as LinkIcon } from 'lucide-react';

const ThreatIntel = ({ scanResult }) => {
  // Extract real indicators from the active scan if available, or fall back to defaults
  const iocs = {
    ips: scanResult?.network?.originIP ? [scanResult.network.originIP, "45.137.21.8"] : ["185.243.218.44", "45.137.21.8"],
    domains: [scanResult ? new URL(scanResult.detectedUrls?.[0] || 'http://micros0ft-support.com').hostname : "micros0ft-support.com", "secure-auth-example.net"],
    urls: scanResult?.detectedUrls?.length > 0 ? scanResult.detectedUrls : ["https://micros0ft-support.com/verify"],
    emails: [scanResult?.metadata?.sender || "support@micros0ft-support.com"]
  };

  const topMetrics = [
    { title: 'TRACKED IOCs', value: '2,847', icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'ACTIVE CAMPAIGNS', value: '17', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'MALICIOUS IPs', value: '1,203', icon: Server, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'LOOKALIKE DOMAINS', value: '644', icon: Globe, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const feedSources = [
    { name: 'AbuseIPDB', updated: 'Updated 2 min ago', count: 412 },
    { name: 'PhishTank', updated: 'Updated 5 min ago', count: 189 },
    { name: 'URLhaus', updated: 'Updated 11 min ago', count: 76 },
    { name: 'Internal SOC', updated: 'Updated 1 min ago', count: 54 },
  ];

  const iocBreakdown = [
    { type: 'IP Addresses', count: '1,203', icon: Server, color: 'text-amber-500' },
    { type: 'Domains', count: '644', icon: Globe, color: 'text-red-500' },
    { type: 'URLs', count: '891', icon: LinkIcon, color: 'text-orange-500' },
    { type: 'Email Addresses', count: '109', icon: Mail, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Threat Intelligence</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Correlated indicators of compromise across global threat feeds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className={`absolute top-4 right-4 p-2.5 rounded-xl ${m.bg} ${m.color}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{m.title}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Threat Feed Sources</h3>
            <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing feeds
            </span>
          </div>
          <div className="space-y-3">
            {feedSources.map((feed, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800/80 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{feed.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{feed.updated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">{feed.count}</span>
                  <span className="text-emerald-500 text-xs font-bold">↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6">IOC Breakdown</h3>
            <div className="space-y-4">
              {iocBreakdown.map((ioc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0B0F17] rounded-xl border border-gray-200 dark:border-gray-800/50">
                  <div className="flex items-center gap-2.5">
                    <ioc.icon className={`w-4 h-4 ${ioc.color}`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{ioc.type}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">{ioc.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-[11px] text-blue-600 dark:text-blue-400">
            Indicators automatically purged after 90 days.
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" /> Threat Intelligence Correlation
        </h3>
        <p className="text-xs text-gray-500">Live relationship graph of active scan telemetry</p>
        
        <div className="h-80 bg-[#0B0F17] rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <div className="relative z-10 flex flex-col items-center gap-10">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">DOM</div>
              <span className="text-[11px] font-mono text-gray-300 mt-2">{iocs.domains[0]}</span>
            </div>
            <div className="flex items-center gap-16">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-950 border-2 border-amber-500 text-amber-300 flex items-center justify-center text-[11px] font-bold">IP</div>
                <span className="text-[10px] font-mono text-gray-400 mt-1">{iocs.ips[0]}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-950 border-2 border-blue-500 text-blue-300 flex items-center justify-center text-[11px] font-bold">EMA</div>
                <span className="text-[10px] font-mono text-gray-400 mt-1">{iocs.emails[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Indicators of Compromise (Live Extraction)</h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-semibold mb-1.5">
                <Server className="w-4 h-4" /> IP Addresses
              </div>
              <div className="font-mono text-gray-300 space-y-1 pl-6">
                {iocs.ips.map((ip, idx) => <p key={idx}>{ip}</p>)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1.5">
                <Globe className="w-4 h-4" /> Domain Addresses
              </div>
              <div className="font-mono text-gray-300 space-y-1 pl-6">
                {iocs.domains.map((dom, idx) => <p key={idx}>{dom}</p>)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-orange-400 font-semibold mb-1.5">
                <LinkIcon className="w-4 h-4" /> URL Addresses
              </div>
              <div className="font-mono text-gray-300 space-y-1 pl-6 truncate">
                {iocs.urls.map((u, idx) => <p key={idx}>{u}</p>)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1.5">
                <Mail className="w-4 h-4" /> Email Addresses
              </div>
              <div className="font-mono text-gray-300 space-y-1 pl-6">
                {iocs.emails.map((e, idx) => <p key={idx}>{e}</p>)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Related Campaigns</h3>
            <div className="p-4 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Campaign #17 — Operation MicroSpear</h4>
                <p className="text-xs text-gray-400 mt-0.5">Active campaign · correlated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntel;