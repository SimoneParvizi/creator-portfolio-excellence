import React, { useEffect, useRef } from 'react';

const DesignerBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  // Slightly darker colors with higher opacity for better visibility
  const colors = [
    'rgba(200, 200, 220, 0.8)',
    'rgba(180, 180, 210, 0.7)',
    'rgba(160, 160, 200, 0.6)'
  ];

  class Dot {
    x: number;
    y: number;
    size: number;
    originalSize: number;
    vx: number;
    vy: number;
    color: string;
    originalX: number;
    originalY: number;
    
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.originalX = x;
      this.originalY = y;
      this.size = Math.random() * 2 + 0.5; // Slightly larger dots for visibility
      this.originalSize = this.size;
      this.vx = 0;
      this.vy = 0;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    update(mouse: { x: number, y: number }, width: number, height: number, time: number) {
      // Distance from mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150; // Increased influence radius (was 100)
      
      // More noticeable movement relative to mouse position
      if (distance < maxDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (maxDistance - distance) / maxDistance;
        
        // Very strong repulsion (5x stronger than original)
        this.vx -= Math.cos(angle) * force * 0.25; // Was 0.15
        this.vy -= Math.sin(angle) * force * 0.25; // Was 0.15
        
        // No size change during interaction - keeping original size
        // this.size = this.originalSize; // Size does not change with mouse interaction
      } else {
        // Return to original size (if it was changed anywhere else)
        if (this.size > this.originalSize) {
          this.size -= 0.1; // Faster return to original size
        }
        
        // Slightly more noticeable passive movement
        const xOffset = Math.sin(time * 0.0005 + this.originalX * 0.01) * 0.3;
        const yOffset = Math.cos(time * 0.0005 + this.originalY * 0.01) * 0.3;
        
        const homeX = this.originalX + xOffset;
        const homeY = this.originalY + yOffset;
        
        this.vx += (homeX - this.x) * 0.005;
        this.vy += (homeY - this.y) * 0.005;
      }
      
      // Apply velocity with less damping for more persistent movement
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.88; // Was 0.92, now 0.88 for even more movement
      this.vy *= 0.88; // Was 0.92, now 0.88
      
      // Boundary checking
      if (this.x < 0 || this.x > width) {
        this.vx *= -0.5;
        this.x = Math.max(0, Math.min(this.x, width));
      }
      
      if (this.y < 0 || this.y > height) {
        this.vy *= -0.5;
        this.y = Math.max(0, Math.min(this.y, height));
      }
    }
  }

  const createDots = () => {
    if (!canvasRef.current) return;
    
    const { width, height } = sizeRef.current;
    const dots: Dot[] = [];
    const density = Math.min(width, height) * 0.1; // Slightly higher density (more dots)
    const numDots = Math.floor((width * height) / (density * density));
    
    // Grid-based positioning with slight randomness
    const gridSize = Math.sqrt((width * height) / numDots);
    
    for (let i = 0; i < width; i += gridSize) {
      for (let j = 0; j < height; j += gridSize) {
        const randomOffsetX = Math.random() * gridSize * 0.5;
        const randomOffsetY = Math.random() * gridSize * 0.5;
        dots.push(new Dot(i + randomOffsetX, j + randomOffsetY));
      }
    }
    
    dotsRef.current = dots;
  };

  const handleResize = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    // Set display size (css pixels)
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Set actual size in memory (scaled to account for extra pixel density)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Update size refs
    sizeRef.current = {
      width: rect.width,
      height: rect.height
    };
    
    // Scale canvas and context for retina displays
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Recreate dots after resize
    createDots();
  };

  const drawLines = (ctx: CanvasRenderingContext2D, dots: Dot[]) => {
    const maxDistance = 100; // Connection distance
    
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          // More visible connecting lines
          const opacity = 1 - (distance / maxDistance);
          ctx.strokeStyle = `rgba(180, 180, 210, ${opacity * 0.3})`; // Higher opacity for lines
          ctx.lineWidth = 0.5; // Slightly thicker lines
          
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = (timestamp: number) => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const ctx = contextRef.current;
    const { width, height } = sizeRef.current;
    
    // Clear canvas completely for crisper rendering
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw dots
    dotsRef.current.forEach(dot => {
      dot.update(mouseRef.current, width, height, timestamp);
      dot.draw(ctx);
    });
    
    // Draw connecting lines
    drawLines(ctx, dotsRef.current);
    
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    contextRef.current = canvasRef.current.getContext('2d');
    
    if (!contextRef.current) return;
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    rafRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
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
};

export default DesignerBackground;
