import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyBanner({ riskLevel, emergencyMode }) {
  const show = emergencyMode || riskLevel === 'High';
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="ebanner"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="flex items-center gap-3 px-5 py-2.5 bg-danger/10 border-b border-danger/30 overflow-hidden relative"
          style={{ animation: 'emergency-bg 1.5s ease-in-out infinite' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-danger/5 to-transparent pointer-events-none" />
          <AlertTriangle className="w-4 h-4 text-danger animate-pulse shrink-0" />
          <span className="text-xs font-bold text-danger tracking-widest uppercase">
            {emergencyMode
              ? '⚡ EMERGENCY MODE ACTIVE — Enhanced Response Protocol Engaged'
              : '🚨 HIGH RISK DETECTED — Immediate Action Required'}
          </span>
          <span className="ml-auto text-xs text-danger/60 font-mono animate-pulse">PRIORITY ALPHA</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
