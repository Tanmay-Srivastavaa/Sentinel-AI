import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Key, Eye, EyeOff, Save, Check } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);

  // Form States (to make toggles and inputs interactive)
  const [orgName, setOrgName] = useState('Acme Security Operations');
  const [socRegion, setSocRegion] = useState('Asia Pacific');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  
  // Detection Threshold States
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [highThreshold, setHighThreshold] = useState(70);
  const [mediumThreshold, setMediumThreshold] = useState(50);

  // Checkbox States
  const [modules, setModules] = useState({
    spf: true,
    domain: true,
    url: true,
    ai: true,
    headers: true,
  });

  const handleModuleToggle = (key) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Custom Reusable Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }) => (
    <div 
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 flex items-center ${checked ? 'bg-blue-600' : 'bg-gray-600 dark:bg-gray-700'}`}
    >
      <div 
        className={`w-4 h-4 bg-white rounded-full shadow-md absolute transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      ></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure MailSentinel detection, alerts, and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1 shrink-0">
          {[
            { id: 'general', icon: SettingsIcon, label: 'General' },
            { id: 'rules', icon: Shield, label: 'Detection Rules' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'apikeys', icon: Key, label: 'API Keys' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-800' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Organization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Organization Name</label>
                    <input 
                      type="text" 
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">SOC Region</label>
                    <select 
                      value={socRegion}
                      onChange={(e) => setSocRegion(e.target.value)}
                      className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                    >
                      <option>Asia Pacific</option>
                      <option>Europe</option>
                      <option>North America</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Auto-Analyze Inbound Email</h3>
                  <p className="text-xs text-gray-500 mt-1">Automatically run threat analysis on all incoming mail.</p>
                </div>
                <ToggleSwitch checked={autoAnalyze} onChange={setAutoAnalyze} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Display Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                    <span className="text-sm text-gray-900 dark:text-gray-300 font-medium">Theme</span>
                    <span className="text-xs text-gray-500 font-mono">Dark (default)</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                    <span className="text-sm text-gray-900 dark:text-gray-300 font-medium">Timezone</span>
                    <span className="text-xs text-gray-500 font-mono">UTC</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* DETECTION RULES TAB */}
          {activeTab === 'rules' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Detection Thresholds</h3>
                
                {[
                  { label: 'Critical threshold', value: criticalThreshold, setter: setCriticalThreshold, color: 'bg-red-500' },
                  { label: 'High threshold', value: highThreshold, setter: setHighThreshold, color: 'bg-orange-500' },
                  { label: 'Medium threshold', value: mediumThreshold, setter: setMediumThreshold, color: 'bg-amber-500' },
                ].map((slider, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-900 dark:text-gray-300 font-medium">{slider.label}</label>
                      <span className="text-xs font-mono text-gray-500">{slider.value}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={slider.value}
                      onChange={(e) => slider.setter(e.target.value)}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${slider.color.includes('red') ? '#ef4444' : slider.color.includes('orange') ? '#f97316' : '#f59e0b'} ${slider.value}%, #1f2937 ${slider.value}%)`
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Enabled Detection Modules</h3>
                <div className="space-y-3">
                  {[
                    { id: 'spf', label: 'SPF / DKIM / DMARC validation' },
                    { id: 'domain', label: 'Domain lookalike detection' },
                    { id: 'url', label: 'URL reputation checking' },
                    { id: 'ai', label: 'AI behavioral analysis' },
                    { id: 'headers', label: 'Header forensics & relay tracing' },
                  ].map((mod) => (
                    <label key={mod.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${modules[mod.id] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400 dark:border-gray-600 group-hover:border-gray-300'}`}>
                        {modules[mod.id] && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={modules[mod.id]} onChange={() => handleModuleToggle(mod.id)} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{mod.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between p-5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Email Alerts</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Send critical threats to the SOC mailbox.</p>
                  </div>
                </div>
                <ToggleSwitch checked={emailAlerts} onChange={setEmailAlerts} />
              </div>

              <div className="flex items-center justify-between p-5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Slack Notifications</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Push alerts to the #soc-alerts channel.</p>
                  </div>
                </div>
                <ToggleSwitch checked={slackAlerts} onChange={setSlackAlerts} />
              </div>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'apikeys' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">API Keys</h3>
                  <p className="text-xs text-gray-500 mt-1">Keys for integrating MailSentinel with external systems.</p>
                </div>
                
                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-2 shadow-sm">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Production Key</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type={showApiKey ? 'text' : 'password'} 
                      readOnly
                      value="ms_live_8a729f3c8340d2b0d54f76b9a08e1c2d"
                      className="flex-1 bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-900 dark:text-white focus:outline-none"
                    />
                    <button 
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Threat Feed Subscriptions</label>
                <div className="flex flex-wrap gap-2">
                  {['AbuseIPDB', 'PhishTank', 'URLhaus'].map((feed, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3 h-3" /> {feed}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Sticky Save Button aligned to bottom right */}
          <div className="mt-12 flex justify-end">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;