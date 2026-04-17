import { useEffect, useRef, useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldAlert, Users, Radio, Building2, Route, Cpu, TrendingUp, AlertTriangle, Truck, Terminal, Activity, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ResourceBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
        <span className="font-mono text-[10px] font-black text-white bg-white/5 px-2 py-0.5 rounded italic">{value}/{max}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-sm overflow-hidden border border-white/5 relative">
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:1, ease:'circOut' }}
          className="h-full relative z-10" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}80` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export default function ControlCenter() {
  const { simulationResult, emergencyMode, liveLog, appendLiveLog, formatINR } = useSimulation();
  const logRef = useRef(null);
  const [activeTab, setActiveTab] = useState('resources');

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [liveLog]);

  useEffect(() => {
    if (!simulationResult) return;
    const messages = [
      'SATELLITE SYNC: LEO-4 Satellite confirmed — Multi-spectral mapping active',
      'UNIT DISPATCH: Drone recon squad Bravo-6 deployed to northern perimeter',
      'LOGISTICS: Strategic medical relay established at Sector Alpha checkpoint',
      'METEOROLOGY: Wind vector re-analysis indicates 12% shift in spread trajectory',
      'INFRASTRUCTURE: Automated hazard gates triggered at Bridge 14C',
      'BROADCAST: Emergency civil frequency modulation initialized at 156.8 MHz',
    ];
    let i = 0;
    const interval = setInterval(() => {
      appendLiveLog(messages[i % messages.length]);
      i++;
    }, 5000);
    return () => clearInterval(interval);
  }, [simulationResult, appendLiveLog]);

  if (!simulationResult) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-background p-10">
        <div className="relative group">
            <Radio className="w-20 h-20 text-gray-800 animate-pulse group-hover:text-primary transition-colors" />
            <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-ping scale-150 opacity-20" />
        </div>
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mt-8">Operational Command Pending</h2>
        <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.2em] mt-3 max-w-xs text-center leading-loose">
            Nexus core requires active simulation data to initialize control interface.
        </p>
        <button onClick={() => window.location.href='/simulator'} className="mt-8 px-8 py-3 bg-primary text-black font-black uppercase italic tracking-tighter rounded-xl hover:scale-105 transition-all">
            Launch Simulation
        </button>
      </div>
    );
  }

  const { risk_level, risk_score, risk_cause, people_affected, recommendation, damage, zones } = simulationResult;
  const isHigh = risk_level === 'High';
  const riskColor = isHigh ? 'text-danger' : risk_level === 'Moderate' ? 'text-warning' : 'text-safe';
  const riskGlow = isHigh ? 'shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'shadow-[0_0_30px_rgba(14,165,233,0.15)]';

  const resources = {
    rescue: Math.min(24, Math.ceil(risk_score / 5) + 4),
    medical: Math.min(16, Math.ceil(risk_score / 7) + 2),
    evacZones: Math.min(10, (zones?.length || 1) * 2),
  };

  return (
    <div className={`w-full h-full overflow-y-auto bg-background p-8 hide-scrollbar ${emergencyMode ? 'emergency-active' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* TOP STATUS ROW */}
        <header className="flex justify-between items-start border-b border-white/5 pb-8">
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isHigh ? 'border-danger/40 bg-danger/10' : 'border-primary/40 bg-primary/10'} ${riskGlow}`}>
                    <ShieldAlert className={`w-7 h-7 ${isHigh ? 'text-danger animate-pulse' : 'text-primary'}`} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Command Intelligence HUB</h1>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-primary" /> Integrated Response Network v3.0GA
                    </p>
                </div>
            </div>
            
            <div className="flex gap-6">
                <div className="text-right">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">Tactical System Clock</p>
                    <p className="text-2xl font-black font-mono text-white italic tracking-tighter">{new Date().toLocaleTimeString()}</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="text-right">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 italic">Network Uptime</p>
                    <p className="text-2xl font-black font-mono text-primary italic tracking-tighter">04:12:09</p>
                </div>
            </div>
        </header>

        {/* MAIN HUD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* THREAT VECTOR PANEL */}
            <div className={`lg:col-span-8 glass-panel p-8 relative overflow-hidden border-2 ${isHigh ? 'border-danger/20' : 'border-primary/20'} ${riskGlow}`}>
                <div className="absolute top-0 right-0 p-4">
                    <Zap className={`w-8 h-8 opacity-10 ${riskColor}`} />
                </div>
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2 italic">Threat Assessment Index</p>
                        <div className={`text-7xl font-black ${riskColor} italic tracking-tighter uppercase leading-none flex items-baseline gap-4`}>
                            {risk_level}
                            <span className="text-sm font-mono text-gray-600 bg-white/5 px-3 py-1 rounded-full not-italic tracking-normal">LVL-9 Verified</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3 italic">Calculated Risk Score</p>
                           <div className="flex items-baseline gap-3">
                              <span className="text-5xl font-black font-mono text-white leading-none">{risk_score}</span>
                              <span className="text-lg font-black text-gray-700 italic">/100</span>
                           </div>
                           <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                               <motion.div initial={{ width:0 }} animate={{ width: `${risk_score}%` }} transition={{ duration:1.5, ease:'circOut' }}
                                    className={`h-full ${isHigh ? 'bg-danger' : 'bg-primary'}`} />
                           </div>
                        </div>
                        
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3 italic">Primary Drivers</p>
                           <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:border-primary/40 transition-all">
                              <Cpu className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100" />
                              <p className="text-sm font-black text-gray-300 uppercase italic tracking-tight">{risk_cause}</p>
                           </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl relative group">
                        <Info className="absolute top-4 right-4 w-4 h-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 italic">Strategic Response Protocol</p>
                        <p className="text-base font-black text-white leading-relaxed italic tracking-tight">
                            "{recommendation}"
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40" />)}
                            </div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">8 Units on standby</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* IMPACT SIDEBAR */}
            <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-8 bg-black/40 border-white/5 group hover:border-warning/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="w-5 h-5 text-warning opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[9px] font-black text-danger uppercase tracking-[0.2em] italic animate-pulse">Critical Zone</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-1">Impacted Population</p>
                    <p className="text-5xl font-black text-white italic tracking-tighter">{people_affected.toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-2">
                         <div className="h-[2px] flex-1 bg-white/5">
                            <div className="h-full w-2/3 bg-warning animate-shimmer" />
                         </div>
                         <span className="text-[9px] font-black text-warning uppercase">72% Density</span>
                    </div>
                </div>

                <div className="glass-panel p-8 bg-black/40 border-white/5 group hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <Building2 className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] italic">Infrastructure</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-1">Economic Exposure</p>
                    <p className="text-4xl font-black text-danger italic tracking-tighter uppercase">{formatINR((damage?.buildings || 0) * 0.45)}</p>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2">Loss estimation v3 Model</p>
                </div>
            </div>

        </div>

        {/* BOTTOM SECTION: RESOURCES + LIVE LOG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* RESOURCE MATRIX */}
            <div className="glass-panel p-8 bg-black/20 border-white/5">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-3 italic">
                        <Truck className="w-4 h-4 text-warning" /> Resource Deployment Matrix
                    </h3>
                    <div className="flex gap-1.5">
                       {['RESCUE', 'MEDICAL', 'LOGS'].map(t => (
                           <button key={t} onClick={() => setActiveTab(t.toLowerCase())}
                            className={`px-3 py-1 rounded text-[8px] font-black transition-all ${activeTab === t.toLowerCase() ? 'bg-primary text-black italic' : 'bg-white/5 text-gray-600 hover:text-white'}`}>
                               {t}
                           </button>
                       ))}
                    </div>
                </div>
                
                <div className="space-y-8">
                    <ResourceBar label="Sector Rescue Operations" value={resources.rescue} max={24} color="#0ea5e9" />
                    <ResourceBar label="Tertiary Medical Support"  value={resources.medical} max={16} color="#10b981" />
                    <ResourceBar label="Emergency Transport Hubs" value={resources.evacZones} max={10} color="#f59e0b" />
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-safe shadow-[0_0_8px_#10b981]" />
                        <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Network Stability: 99%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_#f59e0b]" />
                        <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Latency: 24ms</span>
                    </div>
                </div>
            </div>

            {/* LIVE INTELLIGENCE TERMINAL */}
            <div className="glass-panel bg-black/60 border-white/5 overflow-hidden flex flex-col h-[400px]">
                <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5 relative">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-white italic tracking-tighter uppercase">Live Tactical Intelligence Terminal</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-warning opacity-50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-safe opacity-50" />
                    </div>
                </div>
                
                <div ref={logRef} className="flex-1 overflow-y-auto p-6 space-y-4 font-mono relative scroll-smooth hide-scrollbar">
                    {/* Retro Scan Lines */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
                    
                    <AnimatePresence initial={false}>
                        {liveLog.map((entry, idx) => (
                            <motion.div key={entry.id || idx}
                                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                                className="flex gap-4 group"
                            >
                                <span className="text-primary opacity-30 text-[9px] font-black shrink-0">[{entry.ts || '00:00:00'}]</span>
                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tight leading-relaxed group-hover:text-white transition-colors">
                                    {typeof entry === 'string' ? entry : entry.message}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {liveLog.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full opacity-10">
                            <Activity className="w-12 h-12 mb-4 animate-spin-slow" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Listening for Data...</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-black/40 p-4 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic">Nexus Intelligence System v3.0 // Ready.</span>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-black text-primary uppercase italic tracking-tighter">Secure Link Active</span>
                     </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
