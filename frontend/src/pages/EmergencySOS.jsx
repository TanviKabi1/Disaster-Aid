import { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Phone, MapPin, Navigation, Info, Users, LifeBuoy, Heart, Truck, AlertTriangle, Radio, Activity, Terminal } from 'lucide-react';

const SHELTERS = [
    { id: 1, name: 'Sovereign Community Hall', type: 'Medical/Shelter', lat: 28.61, lng: 77.20, cap: '500 seats', status: 'Open' },
    { id: 2, name: 'Reserve Depot B', type: 'Supplies', lat: 28.63, lng: 77.22, cap: '1.2 tons', status: 'Active' },
    { id: 3, name: 'Apex District Hospital', type: 'Medical', lat: 28.59, lng: 77.19, cap: 'Emergency Ward', status: 'High Occupancy' },
];

const RESPONDERS = [
    { id: 101, name: 'Alpha-9 Strike Team', task: 'Rescue', lat: 28.62, lng: 77.21, status: 'In Transit' },
    { id: 102, name: 'Logistics Van V-12', task: 'Health', lat: 28.60, lng: 77.20, status: 'Standby' },
];

function EmergencyMap({ userLocation }) {
  const map = useMap();
  useEffect(() => {
    if (userLocation) map.setView([userLocation.lat, userLocation.lng], 13);
  }, [userLocation]);
  return null;
}

export default function EmergencySOS() {
  const { emergencyMode, setEmergencyMode, appendLiveLog } = useSimulation();
  const [sosActive, setSosActive] = useState(false);
  const [userLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi Mock

  const handleSOS = () => {
    setSosActive(true);
    setEmergencyMode(true);
    appendLiveLog('⚠️ SOS BEACON INITIALIZED FROM LOCAL TERMINAL');
    appendLiveLog('📡 Mapping current coordinates to nearest response nodes...');
    setTimeout(() => {
        setSosActive(false);
        appendLiveLog('✅ SOS BROADCAST DISTRIBUTED. NODES 101, 102 ENGAGED.');
    }, 2000);
  };

  return (
    <div className={`h-full w-full flex flex-col bg-background relative overflow-hidden ${emergencyMode ? 'emergency-active' : ''}`}>
      
      {/* ── TOP HUD ── */}
      <div className="h-24 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between px-10 z-20">
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${emergencyMode ? 'bg-danger/20 border-danger animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.3)]' : 'bg-surface/50 border-white/10'}`}>
            <ShieldAlert className={`w-7 h-7 ${emergencyMode ? 'text-danger' : 'text-gray-600'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Emergency Response</h1>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-safe shadow-[0_0_5px_#10b981]" />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] font-mono leading-none">
                    GPS LOCK: {userLocation.lat.toFixed(4)}N / {userLocation.lng.toFixed(4)}E
                </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-center">
            <AnimatePresence>
                {emergencyMode && (
                    <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
                        className="glass-panel px-6 py-3 border-primary/20 bg-primary/5 flex items-center gap-4 hidden md:flex">
                        <div className="flex -space-x-3">
                            {[...Array(3)].map((_,i) => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-primary/20 flex items-center justify-center text-[10px] font-black italic shadow-xl">R{i+1}</div>)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase italic tracking-widest leading-none">Nearby Responders</p>
                            <p className="text-xs font-black text-white mt-1">3 ACTIVE NODES</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <button onClick={() => setEmergencyMode(!emergencyMode)}
                className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase italic tracking-widest transition-all ${emergencyMode ? 'bg-danger border-danger text-black shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}>
                {emergencyMode ? 'ALERTS ON' : 'ACTIVATE'}
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ── CONTROL PANEL ── */}
        <div className="w-[480px] h-full border-r border-white/5 bg-surface/30 backdrop-blur-2xl p-10 space-y-12 overflow-y-auto hide-scrollbar z-10 shadow-2xl">
          
          {/* BEACON */}
          <div className="text-center space-y-8">
            <div className="relative inline-block">
                <AnimatePresence>
                    {emergencyMode && (
                        <>
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 2, opacity: 0.2 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-danger rounded-full" />
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 2.5, opacity: 0.1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute inset-0 bg-danger rounded-full" />
                        </>
                    )}
                </AnimatePresence>
                <button 
                    onClick={handleSOS}
                    disabled={sosActive}
                    className={`w-48 h-48 rounded-full flex flex-col items-center justify-center gap-3 border-[10px] transition-all duration-700 relative z-10 group overflow-hidden ${
                        sosActive ? 'bg-danger/90 border-danger scale-95 shadow-none' : 
                        emergencyMode ? 'bg-danger border-danger shadow-[0_40px_80px_rgba(239,68,68,0.5)] hover:scale-105' : 
                        'bg-white/5 border-white/10 text-gray-700 hover:border-white/30 hover:text-white'
                    }`}>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <LifeBuoy className={`w-14 h-14 relative z-10 ${sosActive ? 'animate-spin' : ''}`} />
                    <span className="font-black text-3xl italic tracking-tighter relative z-10">SOS</span>
                </button>
            </div>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest px-8 leading-relaxed italic opacity-70">
                Engage core beacon to synchronize location assets with nearest response units. Use only in critical situations.
            </p>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.05)]" />

          {/* CONTACTS */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3 italic">
                <Radio className="w-3.5 h-3.5 text-primary" /> Strategic Channels
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { lab: 'Rescue Strike', num: '101', icon: Truck, color: '#ef4444' },
                 { lab: 'Police Core',   num: '100', icon: ShieldAlert, color: '#3b82f6' },
                 { lab: 'Trauma Relay',    num: '102', icon: Zap, color: '#f59e0b' },
                 { lab: 'Nexus Support', num: '108', icon: Info, color: '#10b981' },
               ].map(c => (
                 <motion.div whileHover={{ scale:1.02 }} key={c.lab} className="glass-panel p-5 bg-black/40 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group">
                    <c.icon className="w-5 h-5 mb-3 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: c.color }} />
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">{c.lab}</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter">{c.num}</p>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* ACTION GUIDE */}
          <section className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3 italic">
                <Terminal className="w-3.5 h-3.5 text-warning" /> Tactical Procedures
             </h3>
             <div className="space-y-3">
                {[
                    'Maintain elevation if flood vectors are active.',
                    'Synchronize with broadcast channel 98.4 FM.',
                    'Initiate power conservation protocols on all units.',
                    'Deploy to nearest designated community shelter.'
                ].map((txt, i) => (
                    <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1 }} key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 text-[11px] font-bold text-gray-400 group hover:bg-white/10 transition-all">
                        <span className="text-primary font-mono italic shrink-0">0{i+1}</span>
                        <span className="group-hover:text-white transition-colors leading-relaxed italic">{txt}</span>
                    </motion.div>
                ))}
             </div>
          </section>

        </div>

        {/* ── GEOSPATIAL HUD ── */}
        <div className="flex-1 relative">
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%', filter: 'grayscale(1) invert(1) brightness(0.7) contrast(1.3)' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                <EmergencyMap userLocation={userLocation} />
                
                {/* User Marker */}
                <Marker position={[userLocation.lat, userLocation.lng]} icon={L.divIcon({ className: 'custom-marker', html: `<div class="w-10 h-10 -translate-x-1/2 -translate-y-1/2"><div class="absolute inset-0 bg-primary/20 rounded-full animate-ping" /><div class="absolute inset-2 bg-primary rounded-full border-[3px] border-black shadow-[0_0_15px_#0ea5e9]" /></div>` })}>
                    <Popup className="premium-popup">Sector: User Terminal Prime</Popup>
                </Marker>

                {/* Shelter Markers */}
                {SHELTERS.map(s => (
                    <Marker key={s.id} position={[s.lat, s.lng]} icon={L.divIcon({ className:'s-marker', html:`<div class="w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-surface border-2 border-primary rotate-45 flex items-center justify-center shadow-lg"><div class="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_5px_#0ea5e9]" /></div>` })}>
                        <Popup className="premium-popup">
                            <div className="p-3 space-y-2">
                                <p className="text-sm font-black italic uppercase tracking-tighter text-white">{s.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-gray-500 italic">{s.type}</span>
                                    <div className="w-[1px] h-2 bg-white/10" />
                                    <span className="text-[10px] font-black text-primary italic uppercase">{s.cap}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Responder Markers */}
                {emergencyMode && RESPONDERS.map(r => (
                    <Marker key={r.id} position={[r.lat, r.lng]} icon={L.divIcon({ className:'r-marker', html:`<div class="w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"><div class="absolute inset-0 bg-warning/20 rounded-full animate-pulse" /><div class="w-3 h-3 bg-warning rounded-full border-2 border-black" /></div>` })}>
                        <Popup className="premium-popup">
                            <div className="p-2 font-black italic uppercase text-[11px] text-white">Responder: {r.name}</div>
                        </Popup>
                    </Marker>
                ))}

                {/* Strategic Route */}
                <Polyline positions={[[userLocation.lat, userLocation.lng], [28.61, 77.20]]} color="#0ea5e9" weight={5} opacity={0.6} dashArray="10, 15" />
            </MapContainer>

            {/* MAP OVERLAY LEGENDS */}
            <div className="absolute top-8 right-8 z-[400] space-y-4">
                 <div className="glass-panel p-6 bg-black/80 border-white/10 backdrop-blur-3xl shadow-2xl space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 italic border-b border-white/5 pb-2">Geospatial Legend</p>
                    <div className="flex items-center gap-4 group">
                        <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#0ea5e9]" />
                        <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white transition-colors italic tracking-widest">Active Shelter</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-3 h-3 bg-warning rounded-full shadow-[0_0_10px_#f59e0b] animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white transition-colors italic tracking-widest">Response Node</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 h-[3px] bg-primary border-dashed border-b-2 opacity-60" />
                        <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white transition-colors italic tracking-widest">Evacuation Path</span>
                    </div>
                 </div>
            </div>

            {/* HUD SCAN LINES */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-scan-line-v opacity-15" />
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

      </div>

    </div>
  );
}
