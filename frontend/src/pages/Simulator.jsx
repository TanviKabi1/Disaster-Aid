import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useSimulation } from '../context/SimulationContext';
import LeafletMap from '../components/LeafletMap';
import DamageCards from '../components/DamageCards';
import AIExplanation from '../components/AIExplanation';
import TimelineSlider from '../components/TimelineSlider';
import { Target, Thermometer, Wind, CloudRain, ShieldCheck, AlertTriangle, Zap, Power, Play, Activity, Terminal, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = [
  { name: 'Delhi',            lat: 28.7041, lon: 77.1025 },
  { name: 'Mumbai',           lat: 19.0760, lon: 72.8777 },
  { name: 'Chennai',          lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata',          lat: 22.5726, lon: 88.3639 },
  { name: 'Bangalore',        lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad',        lat: 17.3850, lon: 78.4867 },
  { name: 'Bhubaneswar',      lat: 20.2961, lon: 85.8245 },
  { name: 'Custom Coordinates', lat: 20.0,  lon: 78.0   },
];

const PRESETS = {
  Fire:    { scenario:'Fire',    temp:42, wind:65,  rain:0   },
  Flood:   { scenario:'Flood',   temp:20, wind:30,  rain:180 },
  Cyclone: { scenario:'Cyclone', temp:25, wind:140, rain:220 },
  Earthquake: { scenario:'Earthquake', temp:28, wind:12, rain:0 },
  Drought: { scenario:'Drought', temp:45, wind:10, rain:0 },
};

function Slider({ icon: Icon, label, min, max, value, onChange, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 opacity-50" style={{ color }} />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
        </div>
        <span className="text-xs font-black font-mono text-white italic">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))}
        className="w-full bg-white/5 h-1 rounded-full appearance-none cursor-pointer accent-primary" />
    </div>
  );
}

export default function Simulator() {
  const { 
    simulationResult, setSimulationResult, 
    isRunning, setIsRunning,
    addToHistory, setTimeline, setTimelineIndex, 
    emergencyMode, setEmergencyMode, appendLiveLog 
  } = useSimulation();

  const [params, setParams] = useState({ lat:28.7041, lon:77.1025, temp:26, wind:15, rain:0, scenario:'Fire', city:'Delhi' });

  const p = (k, v) => setParams(prev => ({ ...prev, [k]: v }));

  const handleRun = async () => {
    setIsRunning(true);
    appendLiveLog(`Initiating ${params.scenario} projection for ${params.city}...`);
    
    try {
      const res = await axios.post('http://localhost:5000/analyze', params);
      const result = { ...res.data, params, timestamp: new Date().toISOString() };
      setSimulationResult(result);
      addToHistory(result);
      setTimeline(res.data.timeline || []);
      setTimelineIndex(24);
      setIsRunning(false);
      appendLiveLog('Simulation complete. Risk vectors mapped to geospatial grid.');
    } catch (e) {
      setIsRunning(false);
      appendLiveLog('ERROR: Analysis engine failure.');
    }
  };

  const applyPreset = (key) => {
    setParams(prev => ({ ...prev, ...PRESETS[key], scenario: key }));
    appendLiveLog(`Preset applied: ${key}`);
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      
      {/* ── SIDEBAR ── */}
      <div className="w-[380px] shrink-0 h-full border-r border-white/5 bg-surface/30 backdrop-blur-2xl flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-black/20 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Simulator</h2>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">V3 Predictive Engine</p>
                    </div>
                </div>
                <button onClick={() => setEmergencyMode(!emergencyMode)}
                    className={`p-2 rounded-lg border transition-all ${emergencyMode ? 'bg-danger/20 border-danger text-danger' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                    <Power className={`w-4 h-4 ${emergencyMode ? 'animate-pulse' : ''}`} />
                </button>
            </div>
            
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <select value={params.city}
                    onChange={e => {
                        const city = CITIES.find(c => c.name === e.target.value);
                        if (city) setParams(prev => ({ ...prev, city: city.name, lat: city.lat, lon: city.lon }));
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                    {CITIES.map(c => <option key={c.name} value={c.name} className="bg-surface">{c.name}</option>)}
                </select>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 hide-scrollbar">
          
          <section className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Scenario Preset</h3>
             <div className="grid grid-cols-2 gap-2">
                {Object.keys(PRESETS).map(key => (
                    <button key={key} onClick={() => applyPreset(key)}
                        className={`py-3 rounded-lg border text-[10px] font-black uppercase transition-all ${
                            params.scenario === key ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                        }`}>
                        {key}
                    </button>
                ))}
             </div>
          </section>

          <section className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Environmental Input</h3>
             <div className="space-y-6">
                <Slider icon={Thermometer} label="Temperature (°C)" min={-10} max={60}  value={params.temp} onChange={v=>p('temp',v)} color="#f87171" />
                <Slider icon={Wind}        label="Wind Speed (km/h)" min={0}   max={300} value={params.wind} onChange={v=>p('wind',v)} color="#93c5fd" />
                <Slider icon={CloudRain}   label="Precipitation (mm)" min={0}   max={600} value={params.rain} onChange={v=>p('rain',v)} color="#67e8f9" />
             </div>
          </section>

        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <button onClick={handleRun} disabled={isRunning}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase italic tracking-tighter transition-all group overflow-hidden relative shadow-2xl ${
              isRunning ? 'bg-gray-800 text-gray-600' : 'bg-primary text-black hover:scale-[1.02] active:scale-[0.98]'
            }`}>
            {isRunning ? <Activity className="w-5 h-5 animate-spin" /> : <><Play className="w-4 h-4 fill-current" /> Execute Prediction</>}
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 relative">
            <LeafletMap
                center={[params.lat, params.lon]}
                zones={simulationResult?.zones}
                safeRoute={simulationResult?.safe_route}
                isRunning={isRunning}
                scenario={params.scenario}
            />


        </div>

        {/* HUD result */}
        <div className="p-6 space-y-6 max-h-[50%] overflow-y-auto hide-scrollbar z-30 bg-background/80 backdrop-blur-3xl border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <AnimatePresence>
                {simulationResult && !isRunning && (
                    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black text-white italic leading-none">{simulationResult.risk_score}%</span>
                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${simulationResult.risk_level === 'High' ? 'bg-danger/10 border-danger/40 text-danger' : 'bg-safe/10 border-safe/40 text-safe'}`}>
                                    {simulationResult.risk_level} Risk Level
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Projection Radius</p>
                                    <p className="text-lg font-black text-white uppercase italic">{(simulationResult.zones[0].radius/1000).toFixed(1)} KM</p>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Simulation Scenario</p>
                                    <p className="text-lg font-black text-primary uppercase italic">{params.scenario}</p>
                                </div>
                            </div>
                        </div>

                        <DamageCards damage={simulationResult.damage} scenario={params.scenario} />
                        <TimelineSlider />
                        <AIExplanation reasons={simulationResult.reasons} scenario={params.scenario} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
