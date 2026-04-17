import { Link, useLocation } from 'react-router-dom';
import { Activity, Map, Globe, LifeBuoy, ShieldAlert, BarChart3, Power, RefreshCw, FileText, LayoutGrid, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import EmergencyBanner from './EmergencyBanner';

function cx(...cls) { return cls.filter(Boolean).join(' '); }

export default function Navbar() {
  const location = useLocation();
  const { simulationResult, emergencyMode, setEmergencyMode, appendLiveLog, resetSystem } = useSimulation();

  const links = [
    { name: 'Home',           path: '/',               icon: LayoutGrid },
    { name: 'Globe',          path: '/globe',          icon: Globe },
    { name: 'Simulator',      path: '/simulator',       icon: Map },
    { name: 'AI Reports',     path: '/ai-reports',      icon: Terminal },
    { name: 'Control',        path: '/control-center',  icon: ShieldAlert },
    { name: 'Insights',       path: '/insights',        icon: BarChart3 },
    { name: 'SOS',            path: '/emergency',      icon: LifeBuoy },
  ];

  return (
    <div className="w-full z-50 shrink-0 select-none">
      <nav className="h-16 w-full border-b border-white/5 bg-black/60 backdrop-blur-3xl flex items-center justify-between px-8 relative overflow-hidden">
        {/* Background Scanline Effect */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(14,165,233,0.15)] group-hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all duration-500">
                    <Activity className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tighter text-white italic leading-none group-hover:text-primary transition-colors">NEXUS</span>
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1 leading-none italic">Intelligence V3.0GA</span>
                </div>
            </Link>

            <div className="w-[1px] h-8 bg-white/5 hidden lg:block" />

            <div className="hidden lg:flex gap-2">
                {links.map(({ name, path, icon: Icon }) => {
                    const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
                    return (
                        <Link key={name} to={path}
                            className={cx(
                                'flex items-center gap-2.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest italic transition-all duration-300 relative group',
                                active ? 'text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(14,165,233,0.1)]' : 'text-gray-500 hover:text-white hover:bg-white/5'
                            )}>
                            <Icon className={cx('w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110', active ? 'text-primary' : 'text-gray-600')} />
                            {name}
                            {active && <motion.div layoutId="nav-active" className="absolute bottom-0 inset-x-4 h-[2px] bg-primary shadow-[0_0_10px_#0ea5e9] rounded-full" />}
                        </Link>
                    );
                })}
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
                {/* Reset Action */}
                <button
                    onClick={() => { if(window.confirm('Initialize system factory reset? All active intelligence nodes will be cleared.')) resetSystem(); }}
                    className="p-2.5 text-gray-700 hover:text-white hover:bg-white/5 rounded-xl transition-all group relative"
                    title="Initialize System Reset"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                </button>

                {/* Emergency Critical Toggle */}
                <button
                    onClick={() => { setEmergencyMode(!emergencyMode); appendLiveLog(emergencyMode ? '⚠️ SECURE MODE RESTORED' : '⚡ CRITICAL ALERT PHASE ENGAGED'); }}
                    className={cx(
                        'flex items-center gap-3 px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase italic tracking-widest transition-all duration-500 relative overflow-hidden',
                        emergencyMode
                            ? 'bg-danger/20 border-danger/60 text-danger shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse'
                            : 'bg-white/5 border-white/10 text-gray-600 hover:border-white/30 hover:text-white group'
                    )}>
                    <div className="absolute inset-0 bg-danger/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Power className={cx('w-3.5 h-3.5 relative z-10', emergencyMode ? 'animate-flicker' : '')} />
                    <span className="relative z-10">{emergencyMode ? 'Critical Alert' : 'System Safe'}</span>
                </button>
            </div>

            <div className="w-[1px] h-8 bg-white/5" />

            <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <div className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inset-0 rounded-full opacity-70 ${simulationResult ? 'bg-warning' : 'bg-safe'}`} />
                    <span className={`relative rounded-full h-2.5 w-2.5 ${simulationResult ? 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-safe shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Status</span>
                    <span className="text-[10px] font-black text-white italic uppercase tracking-tighter mt-1 leading-none">
                        {simulationResult ? `${simulationResult.risk_level} Risk` : 'Standby'}
                    </span>
                </div>
            </div>
        </div>
      </nav>
      <EmergencyBanner riskLevel={simulationResult?.risk_level} emergencyMode={emergencyMode} />
    </div>
  );
}
