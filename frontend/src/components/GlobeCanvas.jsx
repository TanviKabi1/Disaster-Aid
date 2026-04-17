import { useEffect, useRef } from 'react';

const HOTSPOTS = [
  [20, 85], [13, 80], [19, 73], [28, 77],
  [35, 139], [-33, 151], [37, -122], [25, 45],
  [-5, 35], [50, 30], [60, -135], [15, 100],
];

function latLngToPoint(lat, lng, rotDeg, cx, cy, r) {
  const phi   = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + rotDeg) * Math.PI) / 180;
  const x3 = r * Math.sin(phi) * Math.cos(theta);
  const y3 = r * Math.cos(phi);
  const z3 = r * Math.sin(phi) * Math.sin(theta);
  return { x: cx + x3, y: cy - y3, z: z3, visible: z3 > -r * 0.15 };
}

export default function GlobeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, angle = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const r = Math.min(W, H) * 0.38;
      ctx.clearRect(0, 0, W, H);

      // Sphere fill
      const sph = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 0, cx, cy, r);
      sph.addColorStop(0,   'rgba(14,165,233,0.12)');
      sph.addColorStop(0.5, 'rgba(10,40,90,0.08)');
      sph.addColorStop(1,   'rgba(8,8,10,0.9)');
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = sph; ctx.fill();

      // Globe ring
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(14,165,233,0.25)'; ctx.lineWidth = 1.2; ctx.stroke();

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); let first = true;
        for (let lng = -180; lng <= 180; lng += 4) {
          const p = latLngToPoint(lat, lng, angle, cx, cy, r);
          if (!p.visible) { first = true; continue; }
          first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          first = false;
        }
        ctx.strokeStyle = 'rgba(14,165,233,0.07)'; ctx.lineWidth = 0.7; ctx.stroke();
      }

      // Longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath(); let first = true;
        for (let lat = -80; lat <= 80; lat += 4) {
          const p = latLngToPoint(lat, lng, angle, cx, cy, r);
          if (!p.visible) { first = true; continue; }
          first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          first = false;
        }
        ctx.strokeStyle = 'rgba(14,165,233,0.04)'; ctx.lineWidth = 0.7; ctx.stroke();
      }

      // Hotspot markers
      const now = Date.now();
      HOTSPOTS.forEach((hs, i) => {
        const p = latLngToPoint(hs[0], hs[1], angle, cx, cy, r);
        if (!p.visible) return;
        const pulse = 0.5 + 0.5 * Math.sin(now / 600 + i * 1.3);
        const dr = 3 + pulse * 2.5;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dr * 5);
        grd.addColorStop(0, `rgba(255,50,50,${0.45 * pulse})`);
        grd.addColorStop(1, 'rgba(255,50,50,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, dr * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, dr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,80,80,${0.75 + 0.25 * pulse})`; ctx.fill();
      });

      // Highlight
      const hi = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, 0, cx, cy, r);
      hi.addColorStop(0, 'rgba(255,255,255,0.06)');
      hi.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      hi.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = hi; ctx.fill();

      angle += 0.12;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />;
}
