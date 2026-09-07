import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Layout from './components/common/Layout';
import Overview from './pages/Overview';
import EmailAnalysis from './pages/EmailAnalysis';
import Investigations from './pages/Investigations';
import InvestigationDetails from './pages/InvestigationDetails';
import ForensicReport from './pages/ForensicReport';
import ThreatIntel from './pages/ThreatIntel';
import Infrastructure from './pages/Infrastructure';
import Settings from './pages/Settings';
import FloatingChatbot from './components/forensics/FloatingChatbot';

function AppContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [triggerDemo, setTriggerDemo] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('overview');
    else if (path.includes('analysis')) setActiveTab('analysis');
    else if (path.includes('investigation')) setActiveTab('investigations');
    else if (path.includes('reports')) setActiveTab('reports');
    else if (path.includes('intel')) setActiveTab('intel');
    else if (path.includes('infra')) setActiveTab('infra');
    else if (path.includes('settings')) setActiveTab('settings');
  }, [location]);

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'overview') navigate('/');
          else if (tab === 'analysis') navigate('/analysis');
          else if (tab === 'investigations') navigate('/investigations');
          else if (tab === 'reports') navigate('/reports');
          else if (tab === 'intel') navigate('/intel');
          else if (tab === 'infra') navigate('/infra');
          else if (tab === 'settings') navigate('/settings');
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onRunDemo={() => {
          navigate('/analysis');
          setTriggerDemo(true);
        }}
      >
        <Routes>
          <Route path="/" element={<Overview onRunDemo={() => { navigate('/analysis'); setTriggerDemo(true); }} />} />
          <Route path="/analysis" element={<EmailAnalysis triggerDemo={triggerDemo} onResetDemo={() => setTriggerDemo(false)} />} />
          <Route path="/investigations" element={<Investigations />} />
          <Route path="/investigation/:id" element={<InvestigationDetails />} />
          
          {/* Support both general report archive and specific case report */}
          <Route path="/reports" element={<ForensicReport />} />
          <Route path="/reports/:id" element={<ForensicReport />} />

          <Route path="/intel" element={<ThreatIntel scanResult={scanResult} />} />
          <Route path="/infra" element={<Infrastructure scanResult={scanResult} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>

      <div className="print:hidden">
        <FloatingChatbot scanResult={scanResult} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}