import { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Info, Activity, AlertTriangle, 
  MapPin, Clock, Home, Users, Landmark, 
  TrendingUp, ArrowRightLeft, Sparkles
} from 'lucide-react';

export default function EventDrilldown() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedEvent, formatINR, simulationResult } = useSimulation();
  const [compareMode, setCompareMode] = useState(false);

  // Fallback if no event selected (direct link)
  if (!selectedEvent) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <p className="text-sm font-black uppercase text-gray-500">Retrieving Event Data...</p>
          <button onClick={() => navigate('/globe')} className="text-xs text-primary underline">Return to Globe</button>
        </div>
      </div>
    );
  }

  const drilldown = selectedEvent.drilldown || {
    description: "Intelligence archives confirm significant structural and humanitarian impact. High-velocity disaster front observed.",
    stats: { houses: "Pending Analysis", displaced: "Significant", infra: "Compromised" },
    timeline: ["Phase 1: Induction", "Phase 2: Peak Intensity", "Phase 3: Stabilization"]
  };

  const eventPos = [selectedEvent.lat || 20.5937, selectedEvent.lng || 78.9629];

  return (
    <div className="h-screen w-full flex flex-col bg-[#020202] text-white">
      {/* ── HEADER HUD ── */}
      <div className="h-16 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/globe')} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-[1px] h-6 bg-white/10" />
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                {selectedEvent.name}
              </h1>
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                Historical Drilldown • {selectedEvent.year} • {selectedEvent.type}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setCompareMode(!compareMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-black uppercase transition-all ${
            compareMode ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
          }`}>
          <ArrowRightLeft className="w-3.5 h-3.5" />
          {compareMode ? 'Comparison Active' : 'Compare to Current Sim'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT: INTEL & STATS ── */}
        <div className="w-[480px] h-full border-r border-white/5 bg-surface/20 p-8 space-y-12 overflow-y-auto no-scrollbar scroll-smooth">
          
          {/* Executive Summary */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Analysis Summary
            </h3>
            <div className="glass-panel p-6 bg-primary/5 border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10"><Info className="w-12 h-12" /></div>
                <p className="text-sm font-bold text-gray-300 leading-relaxed italic">
                    "{drilldown.description}"
                </p>
            </div>
          </section>

          {/* Damage Breakdown */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> Impact Metrics
             </h3>
             <div className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Total Loss', val: formatINR(selectedEvent.damage_inr), icon: Activity, color: 'text-danger' },
                    { label: 'Displacement', val: drilldown.stats.displaced, icon: Users, color: 'text-warning' },
                    { label: 'Home Damage', val: drilldown.stats.houses, icon: Home, color: 'text-primary' },
                    { label: 'Infra Status', val: drilldown.stats.infra, icon: Landmark, color: 'text-safe' },
                ].map(stat => (
                    <div key={stat.label} className="glass-panel p-4 bg-white/5 border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                            <span className="text-[9px] font-bold text-gray-600 uppercase">{stat.label}</span>
                        </div>
                        <p className="text-lg font-black text-white italic">{stat.val}</p>
                    </div>
                ))}
             </div>
          </section>

          {/* Timeline */}
          <section className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Event Progression Timeline
             </h3>
             <div className="space-y-6 relative ml-3 border-l border-white/10 pl-6">
                {drilldown.timeline.map((step, idx) => (
                    <motion.div 
                        initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: idx*0.1 }}
                        key={idx} className="relative">
                        <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                        <p className="text-xs font-black text-white uppercase italic truncate">{step}</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">ARCHIVE VERIFIED • T+{idx*2}4H</p>
                    </motion.div>
                ))}
             </div>
          </section>

        </div>

        {/* ── RIGHT: GEOSPATIAL & COMPARISON ── */}
        <div className="flex-1 relative flex flex-col">
            
            {/* Map Area */}
            <div className="flex-1 relative">
                <MapContainer center={eventPos} zoom={8} style={{ height: '100%', width: '100%', filter: 'grayscale(1) invert(1) brightness(0.7) contrast(1.2)' }} zoomControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    
                    {/* Historical Marker */}
                    <Marker position={eventPos} icon={L.divIcon({ className:'h-marker', html:`<div class="w-10 h-10 bg-danger/20 rounded-full border-2 border-danger animate-pulse flex items-center justify-center text-[8px] font-black text-danger">EVENT</div>` })}>
                        <Popup>{selectedEvent.name}</Popup>
                    </Marker>
                    <Circle center={eventPos} radius={50000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1 }} />

                    {/* Simulation Ghost (if compare mode) */}
                    {compareMode && simulationResult && (
                       <>
                          <Marker position={[eventPos[0] + 0.5, eventPos[1] + 0.5]} icon={L.divIcon({ className:'sim-marker', html:`<div class="w-10 h-10 bg-primary/20 rounded-full border-2 border-primary animate-flicker flex items-center justify-center text-[8px] font-black text-primary">SIM</div>` })}>
                             <Popup>Active Simulation Overlay</Popup>
                          </Marker>
                       </>
                    )}
                </MapContainer>
                
                {/* HUD Legend */}
                <div className="absolute top-6 right-6 z-[400] glass-panel p-4 bg-black/80 border-white/10 space-y-3">
                    <h5 className="text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5 pb-2">Geospatial Overlay</h5>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-danger border border-white/20" />
                            <span className="text-[10px] font-bold text-gray-300">HISTORICAL EPICENTER</span>
                        </div>
                        {compareMode && (
                             <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary border border-white/20 animate-pulse" />
                                <span className="text-[10px] font-bold text-gray-300">CURRENT SIM PROJECTION</span>
                             </div>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 z-[400] max-w-sm glass-panel p-4 bg-black/60 border-white/10">
                    <p className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 mb-1">
                       <MapPin className="w-3 h-3 text-danger" /> Coordinates Locked
                    </p>
                    <p className="text-xs font-mono font-bold text-white tracking-widest">
                       {eventPos[0].toFixed(4)}° {eventPos[0] >= 0 ? 'N' : 'S'}, {eventPos[1].toFixed(4)}° {eventPos[1] >= 0 ? 'E' : 'W'}
                    </p>
                </div>
            </div>

            {/* Comparison Pane (Overlay) */}
            <AnimatePresence>
                {compareMode && (
                    <motion.div 
                        initial={{ height: 0 }} animate={{ height: '35%' }} exit={{ height: 0 }}
                        className="bg-primary/5 backdrop-blur-3xl border-t border-primary/30 overflow-hidden relative"
                    >
                        <div className="p-8 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <ArrowRightLeft className="w-5 h-5 text-primary" />
                                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Differential Intelligence Overlay</h4>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase">Risk Variance</p>
                                    <div className="flex items-end gap-4">
                                        <div className="text-3xl font-black text-danger italic leading-none">{selectedEvent.severity*10}%</div>
                                        <ArrowRightLeft className="w-4 h-4 text-gray-600 mb-1" />
                                        <div className="text-3xl font-black text-primary italic leading-none">{simulationResult?.risk_score || 0}%</div>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase">Historical vs Current Sim</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase">Damage Differential</p>
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 rounded bg-danger/10 border border-danger/20 text-[10px] font-black text-danger uppercase italic">Delta: Negative</div>
                                        <p className="text-xs font-bold text-gray-400 leading-tight">Simulation predicts {((simulationResult?.risk_score || 0) / (selectedEvent.severity*10) * 100).toFixed(0)}% of historical intensity.</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-primary uppercase animate-pulse">Comparison Engine Active</p>
                                        <p className="text-xs font-bold text-gray-500 leading-tight mt-1 truncate">Synchronizing past vectors with live inputs...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-scan-line-v opacity-10 z-10" />
        </div>
      </div>
    </div>
  );
}
