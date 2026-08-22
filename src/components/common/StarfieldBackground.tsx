import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star colors based on stellar spectral classes
    const starColors = [
      '#ffffff', // White (A/F stars)
      '#e0f2fe', // Cool blue-white (B stars)
      '#bae6fd', // Soft cyan
      '#fef3c7', // Warm solar white (G stars)
      '#fed7aa', // Pale amber (K stars)
    ];

    // Generate natural stellar field (varied density, sizes 0.4 to 1.8px)
    const starCount = Math.floor((width * height) / 4500);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      // Clustered / natural spatial distribution
      const x = Math.random() * width;
      const y = Math.random() * height;
      const sizeRandom = Math.random();
      const size = sizeRandom > 0.96 ? 1.8 : sizeRandom > 0.85 ? 1.2 : sizeRandom > 0.5 ? 0.8 : 0.45;
      const baseAlpha = 0.15 + Math.random() * 0.65;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const twinkleSpeed = 0.005 + Math.random() * 0.015;

      stars.push({
        x,
        y,
        size,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed,
        color,
      });
    }

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Render starfield
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        // Ultra-slow, gentle sinusoidal twinkling
        const currentAlpha = Math.max(0.1, star.baseAlpha + Math.sin(time * star.twinkleSpeed + i) * 0.25);

        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Very faint bloom for larger stars
        if (star.size > 1.4) {
          ctx.globalAlpha = currentAlpha * 0.3;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80 dark:opacity-90 transition-opacity">
      {/* Deep Space Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Ultra-subtle diffuse cosmic atmosphere */}
      <div className="absolute inset-0 bg-nebula-cyan pointer-events-none" />
      <div className="absolute inset-0 bg-nebula-indigo pointer-events-none" />
      <div className="absolute inset-0 bg-nebula-amber pointer-events-none" />
    </div>
  );
};
