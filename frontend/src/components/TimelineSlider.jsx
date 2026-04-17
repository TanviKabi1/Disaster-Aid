import { useSimulation } from '../context/SimulationContext';
import { Clock } from 'lucide-react';

export default function TimelineSlider() {
  const { timeline, timelineIndex, setTimelineIndex } = useSimulation();
  if (!timeline || timeline.length === 0) return null;

  const pt = timeline[Math.min(timelineIndex, timeline.length - 1)] || {};
  const riskColor = pt.risk > 75 ? '#ef4444' : pt.risk > 40 ? '#f59e0b' : '#10b981';

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-white">Timeline Simulation</span>
        </div>
        <div className="font-mono text-xs flex items-center gap-2">
          <span className="text-gray-500">T+{timelineIndex}h</span>
          <span className="font-bold" style={{ color: riskColor }}>
            Risk: {(pt.risk || 0).toFixed(0)}
          </span>
        </div>
      </div>

      <input type="range" min={0} max={24} value={timelineIndex}
        onChange={e => setTimelineIndex(parseInt(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: riskColor }}
      />
      <div className="flex justify-between text-xs text-gray-600 -mt-1">
        {['0h', '+6h', '+12h', '+18h', '+24h'].map(l => <span key={l}>{l}</span>)}
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-px h-8 mt-1">
        {timeline.map((p, i) => {
          const col = p.risk > 75 ? '#ef4444' : p.risk > 40 ? '#f59e0b' : '#10b981';
          return (
            <div key={i} onClick={() => setTimelineIndex(i)}
              className="flex-1 rounded-sm cursor-pointer transition-all duration-150"
              style={{
                height: `${Math.max(8, p.risk)}%`,
                backgroundColor: col,
                opacity: i === timelineIndex ? 1 : 0.35,
                transform: i === timelineIndex ? 'scaleY(1.15)' : 'scaleY(1)',
                transformOrigin: 'bottom',
              }}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/30 rounded-lg p-2">
          <div className="text-gray-500">Buildings</div>
          <div className="font-mono font-bold text-white">{(pt.buildings || 0).toLocaleString()}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2">
          <div className="text-gray-500">Displaced</div>
          <div className="font-mono font-bold text-white">{(pt.people || 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
