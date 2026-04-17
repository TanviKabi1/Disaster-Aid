import { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { useSimulation } from '../context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe as GlobeIcon, Zap, History, TrendingUp, AlertCircle, ChevronRight, Activity, Filter, Clock } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { useNavigate } from 'react-router-dom';
import SecurityLockout from '../components/SecurityLockout';

// Simple Pie Chart
function PieChart({ data }) {
  const types = [...new Set(data.map(d => d.type))];
  const counts = types.map(t => data.filter(d => d.type === t).length);
  const total = counts.reduce((a, b) => a + b, 0);
  
  let currentAngle = 0;
  const colors = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <div className="flex items-center gap-6">
      <svg width="60" height="60" viewBox="0 0 32 32" className="-rotate-90">
        {counts.map((count, i) => {
          const percentage = (count / total) * 31.4;
          const strokeDasharray = `${percentage} 31.4`;
          const offset = 31.4 - currentAngle;
          currentAngle += percentage;
          return (
            <circle key={i} r="5" cx="16" cy="16" fill="transparent"
              stroke={colors[i % colors.length]} strokeWidth="10"
              strokeDasharray={strokeDasharray} strokeDashoffset={offset} />
          );
        })}
      </svg>
      <div className="flex-1 space-y-1">
        {types.slice(0, 3).map((type, i) => (
          <div key={type} className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              {type}
            </div>
            <span className="text-gray-300">{((counts[i]/total)*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GlobeIntelligence() {
  const navigate = useNavigate();
  const { 
    historicalData, setHistoricalData, 
    selectedCountry, setSelectedCountry, 
    appendLiveLog, formatINR, setSelectedEvent,
    emergencyMode 
  } = useSimulation();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const globeRef = useRef();

  const countries = [
    { name: 'India',     lat: 20.5937,  lng: 78.9629,  intensity: 0.9, color: '#ff4444' },
    { name: 'Japan',     lat: 36.2048,  lng: 138.2529, intensity: 0.8, color: '#ff8800' },
    { name: 'USA',       lat: 37.0902,  lng: -95.7129, intensity: 0.7, color: '#ffcc00' },
    { name: 'Brazil',    lat: -14.2350, lng: -51.9253, intensity: 0.5, color: '#00ccff' },
    { name: 'Nigeria',   lat: 9.0820,   lng: 8.6753,  intensity: 0.4, color: '#00ffcc' },
    { name: 'China',     lat: 35.8617,  lng: 104.1954, intensity: 0.85, color: '#ff2200' },
  ];

  const types = ["All", "Flood", "Earthquake", "Cyclone", "Drought", "Wildfire"];

  useEffect(() => {
    fetchHistory(selectedCountry);
    const c = countries.find(x => x.name === selectedCountry);
    if (c && globeRef.current) {
        globeRef.current.pointOfView({ lat: c.lat, lng: c.lng, altitude: 1.8 }, 1500);
    }
  }, [selectedCountry]);

  const fetchHistory = async (country) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/historical?country=${country}`);
      setHistoricalData(res.data);
      appendLiveLog(`Intelligence profile synchronized for ${country}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisasters = useMemo(() => {
    if (!historicalData || !historicalData.disasters) return [];
    if (filter === 'All') return historicalData.disasters;
    return historicalData.disasters.filter(d => d.type === filter);
  }, [historicalData, filter]);

  return (
    <div className="h-full w-full bg-background overflow-hidden relative flex">
      <AnimatePresence>
        {emergencyMode && <SecurityLockout />}
      </AnimatePresence>
      
      {/* ── GLOBE SECTION (LEFT) ── */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing h-full w-full">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          width={window.innerWidth - 420}
          height={window.innerHeight - 56}
          pointsData={countries}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius={0.6}
          pointsMerge={true}
          pointAltitude={0.12}
          onPointClick={(pt) => setSelectedCountry(pt.name)}
          atmosphereColor="#0ea5e9"
          atmosphereAltitude={0.15}
        />
        
        {/* HUD Overlay */}
        <div className="absolute top-6 left-6 z-30 space-y-4 max-w-sm">
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            className="glass-panel p-5 border-primary/20 bg-background/50 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <GlobeIcon className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Global Monitoring</h1>
                <p className="text-[10px] text-primary/70 font-mono tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-warning" /> LIVE INTEL FEED ACTIVE
                </p>
              </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Region Selector</span>
                    <Filter className="w-3 h-3" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {countries.map(c => (
                    <button key={c.name} onClick={() => setSelectedCountry(c.name)}
                        className={`px-3 py-1.5 rounded border text-[9px] font-black uppercase transition-all ${
                        selectedCountry === c.name 
                            ? 'bg-primary border-primary text-black shadow-[0_0_12px_rgba(14,165,233,0.5)]' 
                            : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                        }`}>
                        {c.name}
                    </button>
                    ))}
                </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-20 bg-scan-lines z-20" />
      </div>

      {/* ── INSIGHTS PANEL (RIGHT) ── */}
      <div className="w-[420px] h-full border-l border-white/5 bg-surface/50 backdrop-blur-2xl flex flex-col z-30 shadow-2xl shrink-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-gradient-to-br from-black/40 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Intelligence Profile</h2>
            <div className="flex h-1.5 w-1.5 rounded-full bg-safe shadow-[0_0_5px_rgba(16,185,129,1)]" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedCountry}</h3>
            {loading && <Activity className="w-5 h-5 text-primary animate-spin" />}
          </div>
          
          {historicalData?.temporal_intel && (
             <div className="mt-4 glass-panel p-3 bg-primary/5 border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Risk Window</span>
                </div>
                <span className="text-xs font-black text-primary font-mono">{historicalData.temporal_intel.next_window}</span>
             </div>
          )}
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-white/5 bg-black/10 flex gap-2 overflow-x-auto no-scrollbar">
            {types.map(t => (
                <button key={t} onClick={() => setFilter(t)}
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap transition-all border ${
                        filter === t ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                    }`}>
                    {t}
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
          {loading || !historicalData ? (
             <div className="py-20 text-center opacity-30">
                <Activity className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-xs font-black uppercase tracking-widest">Sychronizing Archives...</p>
             </div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel p-4 border-white/5 bg-white/5 group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Impact Frequency</p>
                  <p className="text-2xl font-black font-mono text-white group-hover:text-primary transition-colors">{historicalData.stats.total}</p>
                </div>
                <div className="glass-panel p-4 border-white/5 bg-white/5 group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Dominant Threat</p>
                  <p className="text-xl font-black text-warning italic group-hover:text-white transition-colors">{historicalData.stats.mostFrequent}</p>
                </div>
              </div>

              <section className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-primary" /> Threat Distribution
                </h4>
                <div className="glass-panel p-5 bg-black/30 border-white/5">
                    <PieChart data={historicalData.disasters} />
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-2">
                    <History className="w-3 h-3 text-primary" /> Recorded Historical Events
                </h4>
                <div className="space-y-3">
                  {filteredDisasters.map((d, i) => (
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                      key={d.id} className="glass-panel p-4 hover:bg-white/5 transition-all group border-white/5 hover:border-primary/30">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{d.year}</span>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, idx) => (
                                <div key={idx} className={`w-1 h-3 rounded-full ${idx < (d.severity/2) ? 'bg-danger shadow-[0_0_5px_red]' : 'bg-white/5'}`} />
                            ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <h5 className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase italic truncate">
                            {d.name}
                        </h5>
                        <button 
                            onClick={() => { setSelectedEvent(d); navigate(`/event/${d.id}`); }}
                            className="w-8 h-8 rounded bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between mt-3 text-[10px] font-bold uppercase">
                        <span className="text-gray-500">TYPE: <span className="text-gray-200">{d.type}</span></span>
                        <span className="text-gray-500">LOSS: <span className="text-danger flex items-center gap-1">{formatINR(d.damage_inr)}</span></span>
                      </div>
                    </motion.div>
                  ))}
                  {filteredDisasters.length === 0 && (
                     <p className="text-center py-6 text-xs text-gray-600 font-bold uppercase italic">No records for {filter}</p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
