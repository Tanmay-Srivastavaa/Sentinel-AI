import React, { useState, useEffect } from 'react';
import { Server, ShieldAlert, Globe, Network, MapPin, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for React-Leaflet's default marker icon bug
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const Infrastructure = ({ scanResult }) => {
  // 1. DYNAMIC DATA INTEGRATION
  const originIP = scanResult?.network?.originIP || '185.243.218.44';
  const originCountry = scanResult?.network?.geolocation?.country || 'Germany';
  const originISP = scanResult?.network?.geolocation?.isp || 'Example Hosting DE';
  const originConfidence = scanResult?.aiIntelligence?.threatScore > 80 ? 'High risk' : 'Medium risk';

  // We added `lat` and `lng` to your existing nodes so the map knows where to place them!
  const dynamicRelayNodes = [
    { ip: '103.35.244.16', hostname: 'origin.singapore-relay.sg', country: 'Singapore', asn: 'AS131295', provider: 'Example Hosting SG', risk: 'Suspicious', status: 'Suspicious', lat: 1.3521, lng: 103.8198 },
    { ip: '45.137.21.8', hostname: 'relay.xscspklaws.net', country: 'India', asn: 'AS194982', provider: 'Bulletproof Hosting', risk: 'Suspicious', status: 'Suspicious', lat: 20.5937, lng: 78.9629 },
    // Main dynamic origin node (Defaulting to Germany coordinates)
    { ip: originIP, hostname: scanResult?.metadata?.sender || 'mail.microsoft-support.com', country: originCountry, asn: 'AS153345', provider: originISP, risk: originConfidence, status: 'Suspicious', lat: 51.1657, lng: 10.4515 },
    { ip: '52.114.78.21', hostname: 'mail.company.com', country: 'United States', asn: 'AS8075', provider: 'Company Mail Gateway', risk: 'Low risk', status: 'Trusted', lat: 37.0902, lng: -95.7129 },
  ];

  const [selectedNode, setSelectedNode] = useState(dynamicRelayNodes[2]);

  // Extract coordinates for the routing polyline (connects the nodes in order)
  const polylinePositions = dynamicRelayNodes.map(node => [node.lat, node.lng]);

  useEffect(() => {
    setSelectedNode(dynamicRelayNodes[2]);
  }, [scanResult]);

  const topMetrics = [
    { title: 'RELAYED ASNs', value: scanResult ? '1,204' : '1,203', icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'MONITORED ASNs', value: scanResult ? '343' : '342', icon: Network, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'BULLETPROOF HOSTS', value: scanResult?.aiIntelligence?.threatScore > 80 ? '48' : '47', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'COUNTRIES', value: '61', icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Infrastructure</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">IP, ASN, and hosting intelligence for email relay tracing.</p>
      </div>

      {/* Top 4 Metrics Row */}
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

      {/* Infrastructure Geolocation Map Section */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Infrastructure Geolocation</h3>
            <p className="text-xs text-gray-500 mt-0.5">Email relay path traced across global infrastructure</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Probable Infrastructure Origin</p>
            <p className="text-sm font-bold text-red-500">{originCountry} — {scanResult?.aiIntelligence?.threatScore || 76}% confidence</p>
          </div>
        </div>

        {/* INTERACTIVE LEAFLET MAP VISUAL */}
        <div className="h-[420px] bg-[#0B0F17] rounded-xl border border-gray-800 relative overflow-hidden z-0">
          
          <MapContainer 
            center={[35, 20]} // Centered roughly between Europe/Asia
            zoom={2.5} 
            scrollWheelZoom={false} 
            className="w-full h-full absolute inset-0 z-0"
          >
            {/* Dark Mode CartoDB Map Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Glowing Red Routing Line */}
            <Polyline positions={polylinePositions} color="#EF4444" dashArray="5, 10" weight={2} opacity={0.6} />

            {/* Clickable Map Markers */}
            {dynamicRelayNodes.map((node, index) => (
              <Marker 
                key={index} 
                position={[node.lat, node.lng]} 
                eventHandlers={{ click: () => setSelectedNode(node) }} // Updates floating card!
              />
            ))}
          </MapContainer>

          {/* Absolute Overlays (Kept your beautiful UI exact!) */}
          
          {/* Side Floating Location Details Card */}
          <div className="absolute top-6 right-6 w-72 bg-[#111827]/95 backdrop-blur border border-gray-800 p-4 rounded-xl shadow-2xl space-y-4 text-xs z-[1000]">
            <h4 className="font-bold text-gray-200 border-b border-gray-800 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> Location Details
            </h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">IP Address</span>
                <span className="font-mono text-gray-200">{selectedNode.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Country</span>
                <span className="font-semibold text-gray-200">{selectedNode.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider</span>
                <span className="font-medium text-gray-200 truncate max-w-[140px]">{selectedNode.provider}</span>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-2">
                <span className="text-gray-500">ASN</span>
                <span className="font-mono text-cyan-400">{selectedNode.asn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confidence</span>
                <span className="font-semibold text-amber-400">{selectedNode.risk}</span>
              </div>
              <div className="pt-1 font-mono text-[11px] text-gray-400 bg-gray-900 p-2 rounded border border-gray-800 truncate">
                {selectedNode.hostname}
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-6 flex items-center gap-6 text-[11px] text-gray-400 z-[1000] bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Suspicious</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Trusted</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500">
          IP geolocation identifies infrastructure location, not the physical location of an attacker.
        </p>
      </div>

      {/* Relay IP Intelligence Table */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Relay IP Intelligence</h3>
          <p className="text-xs text-gray-500 mt-0.5">Comprehensive audit trail of intermediate SMTP relay nodes.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/20">
                <th className="py-3.5 px-6">IP Address</th>
                <th className="py-3.5 px-6">Hostname</th>
                <th className="py-3.5 px-6">Country</th>
                <th className="py-3.5 px-6">ASN</th>
                <th className="py-3.5 px-6">Provider</th>
                <th className="py-3.5 px-6">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60 font-medium">
              {dynamicRelayNodes.map((node, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedNode(node)}
                  className={`cursor-pointer transition-colors ${selectedNode.ip === node.ip ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'}`}
                >
                  <td className="py-4 px-6 font-mono font-bold text-blue-500">{node.ip}</td>
                  <td className="py-4 px-6 font-mono text-gray-700 dark:text-gray-300">{node.hostname}</td>
                  <td className="py-4 px-6 text-gray-800 dark:text-gray-200">{node.country}</td>
                  <td className="py-4 px-6 font-mono text-cyan-400">{node.asn}</td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{node.provider}</td>
                  <td className="py-4 px-6">
                    {node.status === 'Suspicious' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1 w-fit">
                        <AlertOctagon className="w-3 h-3" /> Suspicious
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Trusted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;