import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Shield, Activity, Zap, Globe, Target, Terminal, Radio, Info } from 'lucide-react';
import GlobeCanvas from '../components/GlobeCanvas';
import { useSimulation } from '../context/SimulationContext';

export default function Home() {
  const navigate = useNavigate();
  const { simulationHistory } = useSimulation();

  return (
    <div className="relative w-full h-full overflow-y-auto flex flex-col items-center justify-start bg-background hide-scrollbar">
      
      {/* ── HERO SECTION ── */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-8">
        {/* Immersive Background Layers */}
        <div className="absolute inset-0 bg-[#060608]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(14,165,233,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(239,68,68,0.08),transparent_50%)]" />
        
        {/* Dynamic Grid System */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Central Visualization */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen">
          <GlobeCanvas />
        </div>

        {/* Scan line Animation */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:100%_4px] animate-scan" />

        {/* Content Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center flex flex-col items-center gap-8 max-w-6xl pt-20"
        >
          {/* System Status Badge */}
          <motion.div 
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2 }}
            className="group flex items-center gap-3 px-6 py-2.5 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-3xl hover:border-primary/50 transition-all cursor-default"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-safe opacity-75" />
              <span className="relative rounded-full h-2.5 w-2.5 bg-safe" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase italic">NEXUS · INTELLIGENCE COMMAND ACTIVE</span>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.85] select-none italic uppercase">
                <span className="text-white">Global</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-shimmer">Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-black uppercase tracking-widest italic opacity-60">
                Predictive Analytics · Strategic Monitoring · Response Optimization
            </p>
          </div>

          <p className="text-base text-gray-400 max-w-xl leading-relaxed font-bold tracking-tight">
            High-fidelity disaster modeling and real-world intelligence integration. 
            Map risks, simulate scenarios, and coordinate emergency response protocols from a unified strategic hub.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={() => navigate('/globe')}
              className="px-10 py-4 bg-primary text-black font-black uppercase italic tracking-tighter rounded-xl shadow-[0_20px_50px_rgba(14,165,233,0.3)] transition-all">
               Strategic Monitoring
            </motion.button>
            
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={() => navigate('/simulator')}
              className="px-10 py-4 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-black uppercase italic tracking-tighter rounded-xl backdrop-blur-xl transition-all">
               Projection Engine
            </motion.button>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mt-12 pt-12 border-t border-white/5 w-full">
            {[
              { label: 'Active Simulations', value: simulationHistory.length || 0, icon: Activity },
              { label: 'Global Risk Index',   value: 'Stable', icon: Target },
              { label: 'Intelligence Nodes', value: '42 Active', icon: Terminal },
              { label: 'Response Latency',    value: '< 450ms', icon: Zap },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.8 + i*0.1 }}
                className="text-center group cursor-default">
                <div className="flex flex-col items-center gap-2">
                    <s.icon className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors" />
                    <div className="text-3xl font-black text-white font-mono italic tracking-tighter group-hover:scale-110 transition-transform">{s.value}</div>
                    <div className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── INTELLIGENCE FLOW SECTION ── */}
      <section className="w-full max-w-7xl px-8 py-32 bg-black/50 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { icon: Globe, title: 'Global Awareness', desc: 'Real-time telemetry and historical archiving across 190+ sovereign regions.', color: '#0ea5e9' },
                { icon: Shield, title: 'Strategic Shield', desc: 'Weighted risk scoring optimized for economic impact and civilian protection.', color: '#10b981' },
                { icon: Radio, title: 'Interagency Link', desc: 'Instantaneous data sharing between simulation cores and response units.', color: '#ef4444' }
            ].map((f, i) => (
                <div key={i} className="glass-panel p-10 bg-white/[0.02] border border-white/5 group hover:border-primary/40 hover:bg-white/5 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:border-primary/20 transition-all">
                        <f.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-xl font-black text-white italic uppercase mb-3 tracking-tighter">{f.title}</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
            ))}
         </div>
         
         <div className="mt-20 glass-panel p-1 border-white/5 bg-white/5 rounded-3xl overflow-hidden group">
            <div className="bg-background/80 p-12 rounded-[22px] flex flex-col md:flex-row items-center justify-between gap-12 group-hover:bg-background/40 transition-all">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Strategic Protocol</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
                        Initialize Nexus Response Core?
                    </h2>
                    <p className="text-gray-400 font-bold leading-relaxed">
                        Access the mission-critical command center to coordinate global resources, analyze real-time threats, and deploy strategic assets.
                    </p>
                </div>
                <button onClick={() => navigate('/control-center')} className="shrink-0 px-12 py-5 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all">
                    Establish Connection
                </button>
            </div>
         </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full max-w-7xl px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40" />
             <span className="text-xs font-black uppercase tracking-[0.2em] italic text-white">NEXUS INTELLIGENCE COMMAND</span>
         </div>
         <div className="flex gap-10">
             <span className="text-[10px] font-black uppercase text-gray-500 italic">V3.0 GA // STABLE</span>
             <span className="text-[10px] font-black uppercase text-gray-500 italic">Uptime: 99.98%</span>
             <span className="text-[10px] font-black uppercase text-gray-500 italic">© 2026 NEXUS CORE</span>
         </div>
      </footer>
    </div>
  );
}
