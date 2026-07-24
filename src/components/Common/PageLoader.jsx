import { useEffect, useRef, useState } from 'react';
import './PageLoader.css';

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 60;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pl-canvas" aria-hidden="true" />;
}

export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="pl-overlay" role="status" aria-live="polite">
      <Particles />

      {/* Ambient glow blobs */}
      <div className="pl-blob pl-blob-1" aria-hidden="true" />
      <div className="pl-blob pl-blob-2" aria-hidden="true" />

      <div className="pl-center">
        {/* Spinner rings */}
        <div className="pl-spinner-wrap" aria-hidden="true">
          <div className="pl-ring pl-ring-outer" />
          <div className="pl-ring pl-ring-mid" />
          <div className="pl-ring pl-ring-inner" />
          <div className="pl-core">
            <span className="pl-core-dot" />
          </div>
        </div>

        <p className="pl-label">{label}</p>
        <div className="pl-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
