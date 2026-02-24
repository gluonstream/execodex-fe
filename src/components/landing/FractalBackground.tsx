import { useRef, useEffect } from 'react';

interface Gluon {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
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
    const gluons: Gluon[] = [];

    // Rotation angles
    const rotation = { z: 0 };

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

    const createGluon = () => {
      const life = 100 + Math.random() * 150;
      // 15% chance for a theme-colored gluon (muonstream branding)
      const isThemeGluon = Math.random() < 0.15;
      return {
        x: (Math.random() - 0.5) * canvas.width * 1.5,
        y: (Math.random() - 0.5) * canvas.height * 1.5,
        z: 500 + Math.random() * 1000,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        vz: -2 - Math.random() * 3, // Moving towards the camera
        life: life,
        maxLife: life,
        size: Math.random() * 2 + 1,
        color: isThemeGluon ? '#646cff' : '#ffffff'
      };
    };

    const draw = () => {
      time += 0.005;
      
      // Update rotation
      rotation.z += 0.003;

      // Clear with very slight fade for "trails" effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set blend mode for effects
      ctx.globalCompositeOperation = 'lighter';

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // If mouse is active, shift the center slightly
      const targetX = mouse.active ? centerX + (mouse.x - centerX) * 0.05 : centerX;
      const targetY = mouse.active ? centerY + (mouse.y - centerY) * 0.05 : centerY;

      // Handle Gluons (Background Radiation)
      // Reduced frequency as requested
      if (Math.random() < 0.05) {
        gluons.push(createGluon());
      }

      for (let i = gluons.length - 1; i >= 0; i--) {
        const m = gluons[i];
        m.x += m.vx;
        m.y += m.vy;
        m.z += m.vz;
        m.life--;

        // Perspective projection
        const focalLength = 1000;
        const scale = focalLength / (focalLength + m.z);
        const px = targetX + m.x * scale;
        const py = targetY + m.y * scale;

        if (m.life <= 0 || m.z < -200) {
          gluons.splice(i, 1);
          continue;
        }

        const opacity = (m.life / m.maxLife) * scale;
        const size = m.size * scale;
        const parallaxOffset = m.z * 0.002;

        // Draw two passes for anaglyph 3D (Red/Cyan)
        const drawPass = (colorMode: 'red' | 'cyan') => {
          const offsetX = colorMode === 'red' ? -parallaxOffset : parallaxOffset;
          ctx.beginPath();
          ctx.arc(px + offsetX, py, size, 0, Math.PI * 2);
          
          if (m.color === '#646cff') {
            // Theme color splits into slightly different shades
            ctx.fillStyle = colorMode === 'red' ? `rgba(255, 0, 0, ${opacity * 0.8})` : `rgba(0, 150, 255, ${opacity * 0.8})`;
          } else {
            // White split into pure red/cyan
            ctx.fillStyle = colorMode === 'red' ? `rgba(255, 0, 0, ${opacity * 0.6})` : `rgba(0, 255, 255, ${opacity * 0.6})`;
          }
          ctx.fill();

          // Add glow to gluons
          ctx.shadowBlur = 10 * scale;
          ctx.shadowColor = ctx.fillStyle as string;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw occasional "tracks" for gluons
          if (m.life % 10 === 0) {
             ctx.beginPath();
             ctx.moveTo(px + offsetX, py);
             ctx.lineTo(px + offsetX - m.vx * 10 * scale, py - m.vy * 10 * scale);
             ctx.strokeStyle = colorMode === 'red' ? `rgba(255, 0, 0, ${opacity * 0.2})` : `rgba(0, 255, 255, ${opacity * 0.2})`;
             ctx.stroke();
          }
        };

        drawPass('red');
        drawPass('cyan');
      }

      const size = Math.min(canvas.width, canvas.height) * 0.25;

      const drawFractal = (x: number, y: number, z: number, r: number, angle: number, depth: number, colorMode: 'red' | 'cyan' | 'yellow') => {
        if (depth === 0) return;

        // Calculate 3D branch endpoint relative to current branch start
        let localX2 = Math.cos(angle) * r;
        let localY2 = Math.sin(angle) * r;
        let localZ2 = Math.sin(time + depth * 0.2) * r * 0.5;

        // Apply 2D Rotation (Z axis)
        const rx = localX2 * Math.cos(rotation.z) - localY2 * Math.sin(rotation.z);
        const ry = localX2 * Math.sin(rotation.z) + localY2 * Math.cos(rotation.z);
        const rz = localZ2;

        const x2 = x + rx;
        const y2 = y + ry;
        const z2 = z + rz;

        // Perspective projection
        const focalLength = 1000;
        const scale = focalLength / (focalLength + z);
        const scale2 = focalLength / (focalLength + z2);

        const px1 = targetX + x * scale;
        const py1 = targetY + y * scale;
        const px2 = targetX + x2 * scale2;
        const py2 = targetY + y2 * scale2;

        // Anaglyph 3D: Horizontal parallax based on Z-depth
        // Current implementation combines perspective scale with existing depth parallax
        const parallaxOffset = z2 * 0.001;
        const depthParallax = (9 - depth) * 0.25;
        const offsetX = colorMode === 'red' ? -(depthParallax + parallaxOffset) : (depthParallax + parallaxOffset);

        ctx.beginPath();
        ctx.moveTo(px1 + offsetX, py1);
        ctx.lineTo(px2 + offsetX, py2);
        
        const opacity = (0.02 + (depth / 60)) * (scale + scale2) / 2;
        if (colorMode === 'red') {
          ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        }
        
        ctx.lineWidth = depth * 0.5 * scale2;
        ctx.stroke();

        if (depth > 7) {
          ctx.shadowBlur = 2 * scale2;
          ctx.shadowColor = colorMode === 'red' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 255, 0.5)';
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        const branchAngle = 0.5 + Math.sin(time * 0.8) * 0.4;
        const mouseFactor = mouse.active ? (mouse.x / canvas.width - 0.5) * 0.2 : 0;
        
        drawFractal(x2, y2, z2, r * 0.75, angle + branchAngle + mouseFactor, depth - 1, colorMode);
        drawFractal(x2, y2, z2, r * 0.75, angle - branchAngle + mouseFactor, depth - 1, colorMode);
      };

      // Draw two passes for anaglyph 3D (Red/Cyan)
      // Move the whole fractal away from the camera (baseZ)
      const baseZ = 800;
      const recursionDepth = 8;
      for (let i = 0; i < 8; i++) {
        const startAngle = (i * Math.PI * 2) / 8;
        drawFractal(0, 0, baseZ, size, startAngle, recursionDepth, 'red');
        drawFractal(0, 0, baseZ, size, startAngle, recursionDepth, 'cyan');

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
