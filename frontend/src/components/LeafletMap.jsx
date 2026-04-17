import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useSimulation } from '../context/SimulationContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ZONE_COLORS = {
  Fire:    { danger: '#ff4500', warning: '#ff8c00', monitor: '#ffd700' },
  Flood:   { danger: '#0077cc', warning: '#00aaff', monitor: '#87ceeb' },
  Cyclone: { danger: '#9333ea', warning: '#c084fc', monitor: '#e9d5ff' },
};
const SCENARIO_EMOJI = { Fire: '🔥', Flood: '🌊', Cyclone: '🌪️', warning: '⚠️', monitor: '📡' };

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom(), { animate: true, duration: 0.8 }); }, [center, map]);
  return null;
}

function PulsingMarker({ position, scenario }) {
  const map = useMap();
  useEffect(() => {
    const col = { Fire: '#ff6a00', Flood: '#0ea5e9', Cyclone: '#a855f7' }[scenario] || '#ef4444';
    const icon = L.divIcon({
      className: '',
      html: `<div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:30px;height:30px;border-radius:50%;background:${col};opacity:0.25;animation:pulseOuter 2s ease-out infinite;"></div>
        <div style="position:absolute;width:18px;height:18px;border-radius:50%;background:${col};opacity:0.5;animation:pulseInner 2s ease-out infinite 0.4s;"></div>
        <div style="position:relative;width:10px;height:10px;border-radius:50%;background:${col};box-shadow:0 0 12px ${col};z-index:2;"></div>
      </div>`,
      iconSize: [30, 30], iconAnchor: [15, 15],
    });
    const m = L.marker(position, { icon }).addTo(map);
    return () => map.removeLayer(m);
  }, [map, position, scenario]);
  return null;
}

function ScenarioMarkers({ zones, scenario }) {
  const map = useMap();
  useEffect(() => {
    if (!zones) return;
    const markers = zones.map(zone => {
      const emoji = SCENARIO_EMOJI[scenario] || SCENARIO_EMOJI[zone.type] || '⚠️';
      const icon = L.divIcon({
        className: '',
        html: `<div style="font-size:20px;line-height:1;filter:drop-shadow(0 0 6px rgba(255,150,0,0.9));animation:floatIcon 3s ease-in-out infinite;">${emoji}</div>`,
        iconSize: [24, 24], iconAnchor: [12, 12],
      });
      if (!zone || typeof zone.lat === 'undefined') return null;
      return L.marker([zone.lat, zone.lng], { icon }).addTo(map);
    });
    return () => markers.forEach(m => map.removeLayer(m));
  }, [map, zones, scenario]);
  return null;
}

function HeatLayer({ zones }) {
  const map = useMap();
  useEffect(() => {
    if (!zones || zones.length === 0 || !L.heatLayer) return;
    const pts = [];
    zones.forEach(z => {
      if (!z || typeof z.lat === 'undefined') return;
      const intensity = z.type === 'danger' ? 1.0 : z.type === 'warning' ? 0.6 : 0.3;
      pts.push([z.lat, z.lng, intensity]);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2, s = 0.01 + Math.random() * 0.015;
        pts.push([z.lat + Math.sin(a) * s, z.lng + Math.cos(a) * s, intensity * 0.35]);
      }
    });
    const heat = L.heatLayer(pts, { radius: 32, blur: 22, maxZoom: 17,
      gradient: { 0.2:'#0000ff', 0.4:'#00ffff', 0.65:'#ffff00', 0.85:'#ff6600', 1.0:'#ff0000' }
    }).addTo(map);
    return () => map.removeLayer(heat);
  }, [map, zones]);
  return null;
}

export default function LeafletMap({ center, zones, safeRoute, isRunning, scenario }) {
  const { timelineIndex, timeline } = useSimulation();

  const getRadius = (baseRadius, idx) => {
    if (!timeline || timeline.length === 0) return baseRadius;
    const pt = timeline[Math.min(timelineIndex, timeline.length - 1)];
    if (!pt) return baseRadius;
    const radius = pt?.radius || baseRadius || 0;
    return radius * (idx === 0 ? 1 : idx === 1 ? 0.58 : 0.35);
  };

  const getColor = (zone, idx) => {
    const map = ZONE_COLORS[scenario] || { danger: '#ef4444', warning: '#f59e0b', monitor: '#3b82f6' };
    return map[zone.type] || map.danger;
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
      <div className="absolute inset-0 pointer-events-none z-[400] bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <MapContainer center={center} zoom={11} className="w-full h-full" zoomControl={false}>
        <ChangeView center={center} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM &copy; CARTO'
        />
        {zones && <HeatLayer zones={zones} />}
        {zones && zones.map((zone, idx) => (
          <Circle key={`c${idx}`}
            center={[zone.lat, zone.lng]}
            radius={getRadius(zone.radius, idx)}
            pathOptions={{
              color:       getColor(zone, idx),
              fillColor:   getColor(zone, idx),
              fillOpacity: zone.type === 'danger' ? 0.18 : 0.1,
              weight:      zone.type === 'danger' ? 2 : 1.5,
              dashArray:   zone.type === 'warning' ? '8,8' : zone.type === 'monitor' ? '4,12' : undefined,
            }}
          />
        ))}
        {zones && <ScenarioMarkers zones={zones} scenario={scenario} />}
        {safeRoute && safeRoute.length > 0 && (
          <Polyline positions={safeRoute}
            pathOptions={{ color:'#10b981', weight:3, opacity:0.85, dashArray:'12,8' }} />
        )}
        <PulsingMarker position={center} scenario={scenario} />
      </MapContainer>

      {isRunning && (
        <div className="absolute top-4 right-4 z-[401] bg-surface/90 border border-primary/30 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75" />
            <span className="relative rounded-full h-3 w-3 bg-primary" />
          </span>
          <span className="text-xs font-mono text-primary tracking-wider">PROCESSING</span>
        </div>
      )}

      {timeline && timeline.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[401] bg-surface/90 border border-white/10 backdrop-blur px-3 py-1.5 rounded-lg">
          <span className="text-xs font-mono text-gray-400">T+{timelineIndex}h</span>
        </div>
      )}
    </div>
  );
}
