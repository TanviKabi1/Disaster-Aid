import { motion } from 'framer-motion';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

export default function SecurityLockout() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-[20px] flex flex-col items-center justify-center p-12 overflow-hidden"
    >
      {/* Background Pulse Rings */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 2], opacity: [0.3, 0] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
          className="absolute w-[400px] h-[400px] rounded-full border-4 border-danger/30" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
          className="absolute w-[300px] h-[300px] rounded-full border-8 border-danger/20" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-xl">
        <motion.div 
          animate={{ 
            boxShadow: ["0 0 20px rgba(239,68,68,0.2)", "0 0 50px rgba(239,68,68,0.6)", "0 0 20px rgba(239,68,68,0.2)"] 
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-24 h-24 rounded-3xl bg-danger/10 border-2 border-danger flex items-center justify-center"
        >
          <ShieldAlert className="w-12 h-12 text-danger animate-flicker" />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-5xl lg:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            System Shutdown
          </h2>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[2px] w-8 bg-danger" />
             <span className="text-xs font-black uppercase tracking-[0.4em] text-danger animate-pulse">Critical Mode Active</span>
             <div className="h-[2px] w-8 bg-danger" />
          </div>
        </div>

        <p className="text-base text-gray-400 font-bold leading-relaxed uppercase tracking-tight max-w-sm">
            Access to this intelligence node is restricted during emergency protocols. System resources redirected to active response units.
        </p>

        <div className="pt-8 border-t border-white/5 w-full flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-danger/10 rounded-lg border border-danger/30">
              <Lock className="w-3 h-3 text-danger" />
              <span className="text-[10px] font-black uppercase text-danger font-mono">Terminal Protocol: Locked</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Level 5 Hazard Detected</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Awaiting Command Clearance</span>
              </div>
           </div>
        </div>
      </div>
      
      {/* Scan Lines for the Lockout */}
      <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-20" />
    </motion.div>
  );
}
