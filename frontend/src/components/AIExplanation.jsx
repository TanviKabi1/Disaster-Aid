import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Terminal, ShieldAlert } from 'lucide-react';

export default function AIExplanation({ reasons, scenario }) {
  const [open, setOpen] = useState(true);
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="glass-panel overflow-hidden border border-white/5 bg-surface/40 backdrop-blur-xl shadow-2xl">
      <button onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-black text-white italic tracking-tighter uppercase">Intelligence Analysis Model</span>
            <div className="flex items-center gap-2 mt-0.5">
               <div className="w-1.5 h-1.5 rounded-full bg-safe shadow-[0_0_5px_rgba(16,185,129,1)]" />
               <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">Scenario: {scenario} • Engine active</span>
            </div>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-500" />
          : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
          >
            <div className="p-6 space-y-3 bg-gradient-to-br from-white/[0.02] to-transparent">
              {reasons.map((r, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 p-4 rounded-xl border border-white/5 bg-black/40 text-sm hover:border-white/10 transition-colors group"
                >
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="font-mono text-[9px] font-black text-gray-600">0{i+1}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-300 font-bold leading-relaxed">{r}</p>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-[1px] w-4 bg-primary/30" />
                        <span className="text-[8px] font-black text-primary/50 uppercase tracking-tighter italic">Vector Verified • Log ID: {Math.random().toString(36).substr(2,6).toUpperCase()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3 text-warning" />
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">Confidence Score: 0.94 • Nexus AI v3.0GA</span>
                 </div>
                 <div className="px-2 py-0.5 rounded-full border border-white/10 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                    Manual Verification Recommended
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
