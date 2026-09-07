import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCases } from '../services/api.js';

export default function Investigations() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to pull data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCases();
      setCases(data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run once when the page loads
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header and Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Investigations Log</h1>
          <p className="text-xs text-gray-500 mt-1">Live feed of AI-analyzed email forensic cases.</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm transition-colors font-medium shadow-lg shadow-blue-900/20"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 py-12 text-center text-lg animate-pulse">
          Loading forensic records from Sentinel Database...
        </div>
      ) : (
        /* Styled Table Container */
        <div className="overflow-x-auto bg-[#111827] rounded-2xl shadow-sm border border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900/50">
              <tr className="border-b border-gray-800 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="p-5">Case ID</th>
                <th className="p-5">Sender</th>
                <th className="p-5">Threat Type</th>
                <th className="p-5">Score</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No cases recorded yet. Run an email scan to populate the database.
                  </td>
                </tr>
              ) : (
                cases.map((item) => (
                  <tr 
                    key={item._id || item.caseId} 
                    // This routes the user to the details page when they click the row!
                    onClick={() => navigate(`/investigation/${item.caseId}`)}
                    className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                  >
                    <td className="p-5 font-mono text-sm font-bold text-blue-500">{item.caseId}</td>
                    <td className="p-5 text-sm text-gray-300">{item.sender}</td>
                    <td className="p-5 text-sm text-gray-300">{item.threatType}</td>
                    <td className="p-5 text-sm font-black text-gray-100">{item.threatScore}/100</td>
                    <td className="p-5 text-sm">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                        item.status === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        item.status === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        item.status === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {item.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}