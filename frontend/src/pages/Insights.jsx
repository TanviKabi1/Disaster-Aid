import { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, Target, Globe, History, LayoutDashboard, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-white/10 px-3 py-2 rounded-lg shadow-xl text-xs backdrop-blur-xl">
      <p className="text-gray-400 mb-1 uppercase font-black tracking-widest">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-bold flex items-center gap-2" style={{ color: p.color }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

function SummaryCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="glass-panel p-6 bg-white/5 border-white/5 group hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">{label}</div>
        <Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color }} />
      </div>
      <div className="text-3xl font-black font-mono text-white italic tracking-tighter leading-none">{value}</div>
      {sub && <p className="text-[10px] text-gray-600 mt-2 uppercase font-bold tracking-tight italic">{sub}</p>}
    </div>
  );
}

export default function Insights() {
  const navigate = useNavigate();
  const { simulationResult, simulationHistory, setHistoricalData, historicalData, selectedCountry, setSelectedCountry, formatINR, setSelectedEvent } = useSimulation();
  const [activeTab, setActiveTab] = useState('predicted');
  const [loading, setLoading] = useState(false);

  const countries = ['India', 'USA', 'Japan', 'China', 'Brazil', 'Nigeria'];

  useEffect(() => {
    if (activeTab === 'historical') fetchHistory(selectedCountry);
  }, [activeTab, selectedCountry]);

  const fetchHistory = async (country) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/historical?country=${country}`);
      setHistoricalData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  // ── PREDICTED DATA ──
  const historyChartData = simulationHistory.map((h, i) => ({
    name: `Run ${i+1}`,
    risk:  h.risk_score,
  }));

  const avgRisk = simulationHistory.length
    ? (simulationHistory.reduce((s, h) => s + h.risk_score, 0) / simulationHistory.length).toFixed(1)
    : '—';
  
  const mostCritical = simulationHistory.length
    ? simulationHistory.reduce((a, b) => a.risk_score > b.risk_score ? a : b)
    : null;

  // ── HISTORICAL DATA ──
  const historicalTimeline = historicalData?.timeline || [];
  const historicalPie = historicalData?.disasters ? [...new Set(historicalData.disasters.map(d => d.type))].map(type => ({
      name: type,
      value: historicalData.disasters.filter(d => d.type === type).length
  })) : [];

  return (
    <div className="w-full h-full p-8 overflow-y-auto bg-background hide-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10">

        <header className="flex justify-between items-end border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.15)]">
              <BarChart3 className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Intelligence Analytics</h1>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-2">
                 <Target className="w-3.5 h-3.5 text-primary" /> Command Center Strategic Hub
              </p>
            </div>
          </div>

          <div className="bg-black/40 p-1.5 rounded-2xl flex gap-1 border border-white/5 backdrop-blur-xl">
            {[
              { id: 'predicted', label: 'Predicted (Sim)', icon: LayoutDashboard },
              { id: 'historical', label: 'Historical (Real)', icon: History }
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  activeTab === t.id ? 'bg-primary text-black shadow-lg italic scale-105' : 'text-gray-500 hover:text-white'
                }`}>
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'predicted' ? (
            <motion.div key="pred" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SummaryCard icon={TrendingUp}   label="Avg Simulation Risk"  value={`${avgRisk}%`} sub="Cross-run probability index" color="#0ea5e9" />
                  <SummaryCard icon={AlertTriangle} label="Peak Loss Projection" value={simulationHistory.length ? formatINR(Math.max(...simulationHistory.map(h => h.damage?.buildings || 0)) * 0.45) : '—'} sub="Estimated maximum economic impact" color="#ef4444" />
                  <SummaryCard icon={Globe}        label="High Risk Scenario" 
                    value={mostCritical ? mostCritical.params?.scenario : '—'} 
                    sub={mostCritical ? `${mostCritical.params?.city} • ${mostCritical.risk_score}% Severity` : 'Archive synchronization pending'} color="#f59e0b" />
               </div>

               {simulationHistory.length === 0 ? (
                 <div className="glass-panel py-32 text-center opacity-30 border-dashed border-white/10">
                    <Activity className="w-16 h-16 mx-auto mb-6 text-gray-600 animate-pulse" />
                    <p className="text-sm font-black uppercase tracking-widest italic">No active simulation data found in buffer.</p>
                    <button onClick={() => navigate('/simulator')} className="mt-6 px-6 py-2 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase hover:bg-primary hover:text-black transition-all">Execute New Projection</button>
                 </div>
               ) : (
                <div className="grid grid-cols-1 gap-6">
                   <div className="glass-panel p-8 bg-black/30 border-white/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-primary" /> Risk Progression Matrix — Historical Runs
                      </h3>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={historyChartData}>
                            <defs>
                              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff20" tick={{ fill:'#555', fontSize:9, fontWeight:'bold' }} />
                            <YAxis stroke="#ffffff20" tick={{ fill:'#555', fontSize:9, fontWeight:'bold' }} domain={[0,100]} />
                            <Tooltip content={<Tip />} cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }} />
                            <Area type="monotone" dataKey="risk" stroke="#0ea5e9" strokeWidth={4} fill="url(#riskGrad)" dot={{fill:'#0ea5e9',r:5, strokeWidth:2, stroke:'#000'}} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                </div>
               )}
            </motion.div>
          ) : (
            <motion.div key="hist" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} className="space-y-10">
               <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex gap-2">
                    {countries.map(c => (
                      <button key={c} onClick={() => setSelectedCountry(c)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          selectedCountry === c ? 'bg-primary text-black border-primary italic scale-105 shadow-lg' : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20'
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {loading && <Activity className="w-5 h-5 text-primary animate-spin" />}
               </div>

               {!loading && historicalData && (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <SummaryCard icon={Globe}   label="Intelligence Archives"  value={historicalData.stats.total} sub={`Events recorded in ${selectedCountry}`} color="#0ea5e9" />
                      <SummaryCard icon={AlertTriangle} label="Primary Hazard" value={historicalData.stats.mostFrequent} sub="Highest event frequency" color="#ef4444" />
                      <SummaryCard icon={History} label="Peak Intensity Event" value={historicalData.stats.maxDamageEvent} sub="Greatest historical impact" color="#f59e0b" />
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="glass-panel p-8 bg-black/30 border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-primary" /> Temporal Event Frequency
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={historicalTimeline}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="year" stroke="#ffffff20" tick={{ fill:'#555', fontSize:9, fontWeight:'bold' }} />
                                    <YAxis stroke="#ffffff20" tick={{ fill:'#555', fontSize:9, fontWeight:'bold' }} />
                                    <Tooltip content={<Tip />} />
                                    <Bar dataKey="count" fill="#0ea5e9" radius={[4,4,0,0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="glass-panel p-8 bg-black/30 border-white/5 flex flex-col items-center">
                        <h3 className="text-[10px] font-black w-full uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-3">
                            <Target className="w-4 h-4 text-primary" /> Threat Distribution Profile
                        </h3>
                        <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={historicalPie} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                                        {historicalPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<Tip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mt-4">
                             {historicalPie.map((p, i) => (
                                 <div key={p.name} className="flex items-center gap-2.5 text-[10px] font-black uppercase text-gray-400 group cursor-default">
                                     <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:scale-125 transition-transform" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                     {p.name}
                                 </div>
                             ))}
                        </div>
                      </div>

                      <div className="lg:col-span-2 glass-panel p-8 bg-black/30 border-white/5">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-8 flex items-center gap-3">
                            <History className="w-4 h-4 text-primary" /> Comprehensive Event Archive
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {historicalData?.disasters?.map((d,i) => (
                                <motion.div 
                                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.05 }}
                                    key={i} 
                                    onClick={() => { setSelectedEvent(d); navigate(`/event/${d.id}`); }}
                                    className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className="text-[11px] font-mono font-black text-primary p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-black transition-colors">{d.year}</div>
                                        <div>
                                            <h4 className="text-base font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{d.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{d.type}</span>
                                                <div className="w-[1px] h-2 bg-white/10" />
                                                <span className="text-[10px] text-danger font-black uppercase tracking-wider italic">Sev: {d.severity}/10</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Economic Impact</p>
                                            <p className="text-sm font-black text-danger italic">{formatINR(d.damage_inr)}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                                            <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                         </div>
                      </div>
                   </div>
                 </>
               )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
