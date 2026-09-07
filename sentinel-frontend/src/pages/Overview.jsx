import React from 'react';
import { Mail, ShieldAlert, AlertTriangle, Search, TrendingUp, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const chartData = [
  { name: 'Day 1', safe: 40, suspicious: 15, high: 8, critical: 2 },
  { name: 'Day 5', safe: 32, suspicious: 18, high: 10, critical: 4 },
  { name: 'Day 10', safe: 48, suspicious: 22, high: 12, critical: 5 },
  { name: 'Day 15', safe: 42, suspicious: 28, high: 15, critical: 7 },
  { name: 'Day 20', safe: 55, suspicious: 24, high: 18, critical: 6 },
  { name: 'Day 25', safe: 50, suspicious: 32, high: 22, critical: 9 },
  { name: 'Day 30', safe: 65, suspicious: 35, high: 25, critical: 11 },
];

const Overview = ({ onRunDemo }) => {
  const statCards = [
    { title: 'EMAILS ANALYZED', value: '1,284', change: '+18.4% from last month', icon: Mail, color: 'text-blue-500' },
    { title: 'THREATS DETECTED', value: '187', change: '+12.1% from last month', icon: ShieldAlert, color: 'text-red-500' },
    { title: 'CRITICAL CASES', value: '32', change: '4 cases this week', icon: AlertTriangle, color: 'text-amber-500' },
    { title: 'ACTIVE INVESTIGATIONS', value: '14', change: '3 new since yesterday', icon: Search, color: 'text-cyan-500' },
  ];

  const pipelineItems = [
    { name: 'Detection', count: 187, color: 'bg-red-500' },
    { name: 'Evidence Collection', count: 142, color: 'bg-amber-500' },
    { name: 'Investigation', count: 64, color: 'bg-yellow-500' },
    { name: 'Intelligence Correlation', count: 38, color: 'bg-cyan-500' },
    { name: 'Action & Remediation', count: 22, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Overview</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor suspicious emails, investigations and threat intelligence from one place.</p>
        </div>
        <button 
          onClick={onRunDemo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-colors"
        >
          <TrendingUp className="w-4 h-4" /> Run Demo Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{card.value}</h3>
              <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{card.title}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> {card.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Threat Detection Activity</h3>
              <p className="text-xs text-gray-500 mt-1">Last 30 days · classified by severity</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="safe" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#safeGrad)" />
                <Area type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#critGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Investigation Pipeline</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">Detection → Evidence → Action</p>
            <div className="space-y-5">
              {pipelineItems.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                    <span className="text-gray-900 dark:text-white font-mono">{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / 200) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;