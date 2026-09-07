import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeEmlFile } from '../services/api';
import { UploadCloud, File, AlertCircle, ShieldCheck, Terminal } from 'lucide-react';

export default function EmailAnalysis({ triggerDemo, onResetDemo }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Animation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0); // 0: None, 1: Spinner, 2: Terminal
  const [terminalLines, setTerminalLines] = useState([]);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (triggerDemo) {
      runDemoScan();
    }
  }, [triggerDemo]);

  // Terminal extraction lines for the Hollywood effect
  const extractionSteps = [
    "Mounting .eml payload to secure memory...",
    "Extracting raw MIME boundaries and headers...",
    "Parsing Return-Path and Received routing chain...",
    "Querying IP-API for origin geolocation routing...",
    "Evaluating SPF cryptographic records...",
    "Verifying DKIM public key alignment...",
    "Cross-referencing DMARC policy enforcement...",
    "Extracting embedded URLs and malicious payloads...",
    "Initializing Gemini AI semantic threat engine...",
    "Mapping heuristic indicators and evasion patterns...",
    "Finalizing threat score and compiling report...",
    "Persisting forensic dossier to Sentinel Database..."
  ];

  // Helper to run the terminal typing effect over exactly 3.5 seconds
  const runTerminalAnimation = async () => {
    setAnimationPhase(2);
    setTerminalLines([]);
    
    const stepDuration = 3500 / extractionSteps.length;
    
    for (let i = 0; i < extractionSteps.length; i++) {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
      setTerminalLines(prev => [...prev, `[${timestamp}] SYS_REQ: ${extractionSteps[i]}`]);
      await new Promise(r => setTimeout(r, stepDuration));
    }
  };

  const runDemoScan = async () => {
    setIsAnalyzing(true);
    setError('');
    
    // Phase 1: Engine Wake Up (1.5s)
    setAnimationPhase(1);
    await new Promise(r => setTimeout(r, 1500));

    // Phase 2: Terminal Extraction (3.5s)
    await runTerminalAnimation();

    if (onResetDemo) onResetDemo();

    // Navigate to a sample demo case
    navigate('/investigation/STN-7651');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload an .eml file first.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnimationPhase(1);

    try {
      // Start the actual backend API call in the background
      const apiPromise = analyzeEmlFile(file);
      
      // Phase 1: Force UI to wait 1.5 seconds for the "boot up" effect
      await new Promise(r => setTimeout(r, 1500));
      
      // Phase 2: Run the 3.5 second terminal extraction
      await runTerminalAnimation();

      // Ensure the API is actually finished before we route
      const result = await apiPromise;

      if (result && result.caseId) {
        navigate(`/investigation/${result.caseId}`);
      } else {
        setError('Analysis failed: No Case ID returned from database.');
        setIsAnalyzing(false);
        setAnimationPhase(0);
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError('An error occurred during analysis. Make sure the backend server is running.');
      setIsAnalyzing(false);
      setAnimationPhase(0);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      {/* ========================================= */}
      {/* ANIMATION OVERLAYS                        */}
      {/* ========================================= */}
      
      {/* PHASE 1: Wake Up Spinner (1.5s) */}
      {isAnalyzing && animationPhase === 1 && (
        <div className="absolute inset-0 z-50 bg-[#0B0F17]/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center space-y-4 border border-blue-500/30">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">Sentinel AI Engine Active</h3>
          <p className="text-blue-400 font-mono text-xs animate-pulse">Initializing core forensic modules...</p>
        </div>
      )}

      {/* PHASE 2: Terminal Extraction (3.5s) */}
      {isAnalyzing && animationPhase === 2 && (
        <div className="absolute inset-0 z-50 bg-[#0B0F17]/95 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30 flex flex-col shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-2 text-emerald-500 mb-4 border-b border-emerald-500/20 pb-3">
            <Terminal className="w-5 h-5 animate-pulse" />
            <h3 className="text-sm font-bold tracking-widest uppercase">Deep Extraction Protocol</h3>
          </div>
          <div className="flex-1 overflow-hidden font-mono text-[11px] md:text-xs text-emerald-400/90 space-y-1.5 flex flex-col justify-end pb-2">
             {terminalLines.map((line, idx) => (
               <div key={idx} className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                 {line}
               </div>
             ))}
             <div className="animate-pulse flex items-center gap-2 mt-2 text-emerald-300">
               <span className="w-2 h-4 bg-emerald-500"></span> Processing...
             </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* STANDARD UI (Hidden behind overlays)      */}
      {/* ========================================= */}

      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Email Analysis Engine</h1>
        <p className="text-gray-400 text-sm">Upload a suspicious .eml file for deep AI forensic inspection.</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-[#111827] hover:border-gray-700'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <UploadCloud className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Drag and drop your email file here</h3>
        <p className="text-gray-500 text-sm mb-6">Supports .eml format</p>
        
        <input 
          type="file" 
          accept=".eml" 
          onChange={handleFileChange} 
          className="hidden" 
          id="file-upload"
        />
        <label 
          htmlFor="file-upload" 
          className="px-6 py-2.5 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-700 transition font-medium border border-gray-700"
        >
          Browse Files
        </label>
      </div>

      {file && (
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button 
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-red-400 text-sm transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className={`px-8 py-3 rounded-md font-bold shadow-lg transition-all flex items-center gap-2 ${
            !file || isAnalyzing 
              ? 'bg-blue-900/50 text-blue-300/50 cursor-not-allowed border border-blue-900/30' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20'
          }`}
        >
          {isAnalyzing ? 'Initiating Pipeline...' : 'Run Forensic Scan'}
        </button>
      </div>
    </div>
  );
}