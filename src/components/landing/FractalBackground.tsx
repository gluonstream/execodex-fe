import { useRef, useEffect } from 'react';

interface Muon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export function FractalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    const mouse = { x: 0, y: 0, active: false };
    const muons: Muon[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const createMuon = () => {
      const life = 50 + Math.random() * 100;
      // 15% chance for a theme-colored muon (muonstream branding)
      const isThemeMuon = Math.random() < 0.15;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: life,
        maxLife: life,
        size: Math.random() * 2 + 1,
        color: isThemeMuon ? '#646cff' : '#ffffff'
      };
    };

    const draw = () => {
      time += 0.005;
      
      // Clear with very slight fade for "trails" effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set blend mode for effects
      ctx.globalCompositeOperation = 'lighter';

      // Handle Muons (Background Radiation)
      // Increased frequency slightly since mouse muons are removed
      if (Math.random() < 0.2) {
        muons.push(createMuon());
      }

      for (let i = muons.length - 1; i >= 0; i--) {
        const m = muons[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life--;

        if (m.life <= 0) {
          muons.splice(i, 1);
          continue;
        }

        const opacity = m.life / m.maxLife;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        
        // Use more robust color parsing
        if (m.color === '#646cff') {
          ctx.fillStyle = `rgba(100, 108, 255, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        }
        ctx.fill();

        // Add glow to muons
        ctx.shadowBlur = 10 * opacity;
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw occasional "tracks" for muons
        if (m.life % 10 === 0) {
           ctx.beginPath();
           ctx.moveTo(m.x, m.y);
           ctx.lineTo(m.x - m.vx * 10, m.y - m.vy * 10);
           ctx.strokeStyle = `rgba(100, 108, 255, ${opacity * 0.3})`;
           ctx.stroke();
        }
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // If mouse is active, shift the center slightly
      const targetX = mouse.active ? centerX + (mouse.x - centerX) * 0.05 : centerX;
      const targetY = mouse.active ? centerY + (mouse.y - centerY) * 0.05 : centerY;

      const size = Math.min(canvas.width, canvas.height) * 0.35;

      const drawFractal = (x: number, y: number, r: number, angle: number, depth: number) => {
        if (depth === 0) return;

        const x2 = x + Math.cos(angle + time * 0.5) * r;
        const y2 = y + Math.sin(angle + time * 0.5) * r;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        
        const hue = (time * 50 + depth * 40) % 360;
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.3 + (depth / 10)})`;
        ctx.lineWidth = depth * 1.2;
        ctx.stroke();

        if (depth > 5) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.8)`;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        const branchAngle = 0.5 + Math.sin(time * 0.8) * 0.4;
        const mouseFactor = mouse.active ? (mouse.x / canvas.width - 0.5) * 0.2 : 0;
        
        drawFractal(x2, y2, r * 0.75, angle + branchAngle + mouseFactor, depth - 1);
        drawFractal(x2, y2, r * 0.75, angle - branchAngle + mouseFactor, depth - 1);
      };

      for (let i = 0; i < 5; i++) {
        drawFractal(targetX, targetY, size, (i * Math.PI * 2) / 5 + time * 0.1, 9);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fractal-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
}
