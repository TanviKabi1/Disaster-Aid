import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Route, Banknote, ShieldAlert } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) { setDisplay(0); return; }
    let current = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      current = Math.min(current + step, value);
      setDisplay(Math.floor(current));
      if (current >= value) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

export default function DamageCards({ damage, scenario }) {
  const { formatINR } = useSimulation();
  if (!damage) return null;

  const cards = [
    { icon: Building2, label: 'Buildings Affected', value: damage.buildings, color: 'text-primary', border: 'border-primary/20' },
    { icon: Banknote,  label: 'Economic Loss',      value: formatINR(damage.buildings * 0.45), color: 'text-danger', border: 'border-danger/20', isCustom: true },
    { icon: Users,     label: 'People Impacted',    value: damage.people,    color: 'text-warning', border: 'border-warning/20' },
    { icon: Route,     label: 'Infra Corridor Risk', value: damage.roads,     color: 'text-safe', border: 'border-safe/20' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div key={c.label}
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel p-4 flex flex-col gap-2 bg-white/5 border ${c.border} hover:bg-white/10 transition-colors group`}
          >
            <div className="flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
               <Icon className={`w-3.5 h-3.5 ${c.color}`} />
               <ShieldAlert className="w-2.5 h-2.5 text-gray-600" />
            </div>
            <div className={`text-xl font-black font-mono italic tracking-tighter ${c.color}`}>
              {c.isCustom ? c.value : <AnimatedNumber value={c.value} />}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-tight">{c.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
