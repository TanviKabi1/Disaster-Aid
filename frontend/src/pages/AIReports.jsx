import { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertCircle, Zap, ShieldCheck, ChevronRight, Activity, Search, Globe } from 'lucide-react';
import axios from 'axios';
import SecurityLockout from '../components/SecurityLockout';

function Shimmer() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-4 bg-white/5 rounded w-1/4" />
      <div className="h-8 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/5 rounded w-1/2" />
    </div>
  );
}

export default function AIReports() {
  const { aiReports, setAiReports, emergencyMode } = useSimulation();
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/ai-reports');
        setAiReports(res.data);
        if (res.data.length > 0) setSelectedReport(res.data[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setLoading(false), 800); // Visual delay for "Analyzing" feel
      }
    };
    fetchReports();
  }, []);

  const getSeverityColor = (sev) => {
    if (sev === 'Critical') return 'bg-danger/20 text-danger border-danger/30';
    if (sev === 'High') return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-primary/20 text-primary border-primary/30';
  };

  return (
    <div className="h-full w-full flex bg-background overflow-hidden relative">
      <AnimatePresence>
        {emergencyMode && <SecurityLockout />}
      </AnimatePresence>
      
      {/* ── LEFT: INTEL FEED ── */}
      <div className="w-[450px] h-full border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">Intelligence Feed</h2>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Live Buffer</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input type="text" placeholder="FILTER BY REGION / SEVERITY..." 
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {loading ? (
            Array(4).fill(0).map((_, i) => <Shimmer key={i} />)
          ) : (
            aiReports.map(report => (
              <motion.div
                initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-5 rounded-xl border transition-all cursor-pointer group ${
                  selectedReport?.id === report.id 
                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(14,165,233,0.15)] scale-[1.02]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 font-mono italic">{report.region}</span>
                </div>
                <h3 className="text-sm font-black text-white uppercase italic mb-2 tracking-tight group-hover:text-primary transition-colors">
                    {report.title}
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed truncate">
                    {report.description}
                </p>
                <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-bold text-primary italic">Detailed Intelligence Available</span>
                    <ChevronRight className="w-3.5 h-3.5 text-primary" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT: DETAIL VIEW ── */}
      <div className="flex-1 h-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background grid/glow */}
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />

        <AnimatePresence mode="wait">
          {selectedReport ? (
            <motion.div
              key={selectedReport.id}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-20 }}
              className="max-w-3xl w-full p-12 space-y-10"
            >
              <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-primary" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Intelligence Summary Report</span>
                </div>
                <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                    {selectedReport.title}
                </h1>
                <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-black uppercase text-gray-300">{selectedReport.region}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-xs font-black uppercase text-gray-300">{selectedReport.severity} Hazard</span>
                    </div>
                </div>
              </header>

              <div className="grid grid-cols-5 gap-8">
                <div className="col-span-3 space-y-8">
                    <section className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" /> Executive Context
                        </h4>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed font-mono">
                            {selectedReport.description}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-warning flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5" /> AI Predictive Analysis
                        </h4>
                        <div className="glass-panel p-6 bg-white/5 border-white/5 leading-relaxed text-sm text-white">
                            {selectedReport.analysis}
                        </div>
                    </section>
                </div>

                <div className="col-span-2">
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-safe flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" /> Intelligence Insights
                        </h4>
                        <div className="space-y-3">
                            {selectedReport.insights.map((insight, idx) => (
                                <motion.div 
                                    initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay: idx*0.1 }}
                                    key={idx} className="glass-panel p-4 bg-black/40 border-white/5 text-[11px] font-bold text-gray-300 uppercase italic">
                                    {insight}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
              </div>

              <footer className="pt-8 border-t border-white/5">
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                    Generated by NEXUS Intelligence Layer • CRC Check: AF82-7721-09X
                 </p>
              </footer>
            </motion.div>
          ) : (
            <div className="text-center opacity-20">
                <FileText className="w-20 h-20 mx-auto mb-4" />
                <p className="text-sm font-black uppercase tracking-widest">Select a report to begin analysis</p>
            </div>
          )}
        </AnimatePresence>

        {/* Scan effect */}
        <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-10" />
      </div>
    </div>
  );
}
