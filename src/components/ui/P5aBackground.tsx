
import React, { useEffect, useRef } from 'react';

const P5aBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const timeRef = useRef<number>(0);

  // Very minimal color palette with subtle gray dots
  const colors = [
    'rgba(200, 200, 200, 0.4)',
    'rgba(180, 180, 180, 0.3)',
    'rgba(160, 160, 160, 0.2)',
  ];

  class Dot {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    connected: boolean;
    baseX: number;
    baseY: number;
    speed: number;
    angle: number;
    
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = Math.random() * 1 + 0.5; // Very small dots
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vx = 0;
      this.vy = 0;
      this.connected = false; // Used to track if dot is in a line
      this.speed = Math.random() * 0.0005 + 0.0002; // Very slow movement speed
      this.angle = Math.random() * Math.PI * 2; // Random initial angle
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    update(mouse: { x: number, y: number }, time: number, width: number, height: number) {
      // Very minimal movement only when close to mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 60; // Small influence radius
      
      if (distance < maxDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (maxDistance - distance) / maxDistance;
        
        // Extremely subtle movement
        this.vx -= Math.cos(angle) * force * 0.02;
        this.vy -= Math.sin(angle) * force * 0.02;
      }
      
      // Add subtle time-based movement (gentle organic motion)
      // Figure 8 / infinity pattern movement
      const xMovement = Math.sin(time * this.speed + this.angle) * 0.5;
      const yMovement = Math.sin(time * this.speed * 2 + this.angle) * Math.cos(time * this.speed + this.angle) * 0.5;
      
      // Blend time-based movement with mouse interaction
      this.x += this.vx + xMovement;
      this.y += this.vy + yMovement;
      
      // Slow return to original position
      const returnSpeed = 0.01;
      this.x += (this.baseX - this.x) * returnSpeed;
      this.y += (this.baseY - this.y) * returnSpeed;
      
      // Apply very minimal velocity with strong damping
      this.vx *= 0.9;
      this.vy *= 0.9;
      
      // Reset connected state for this frame
      this.connected = false;
    }
  }

  const createDots = () => {
    if (!canvasRef.current) return;
    
    const { width, height } = sizeRef.current;
    const dots: Dot[] = [];
    
    // Create a grid of dots with more space between them (sparse)
    const gridSize = 30; // Grid cell size (larger = more sparse)
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        // Add some randomness to positions
        const randX = x + (Math.random() * 10 - 5);
        const randY = y + (Math.random() * 10 - 5);
        dots.push(new Dot(randX, randY));
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
    const maxDistance = 40; // Very short connection distance for minimal lines
    
    for (let i = 0; i < dots.length; i++) {
      // Only connect to a maximum of 2 nearest dots
      let connections = 0;
      const connectedDots = [];
      
      // Find closest dots
      for (let j = 0; j < dots.length; j++) {
        if (i === j) continue;
        
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          connectedDots.push({ dot: dots[j], distance });
        }
      }
      
      // Sort by distance and take closest 2
      connectedDots.sort((a, b) => a.distance - b.distance);
      const nearest = connectedDots.slice(0, 2);
      
      // Draw lines to nearest dots
      for (const { dot, distance } of nearest) {
        // Only draw if both dots haven't exceeded connection limit
        if (!dots[i].connected || !dot.connected) {
          const opacity = 1 - (distance / maxDistance);
          ctx.strokeStyle = `rgba(180, 180, 180, ${opacity * 0.2})`; // Very subtle lines
          ctx.lineWidth = 0.2; // Extremely thin lines
          
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dot.x, dot.y);
          ctx.stroke();
          
          // Mark as connected
          dots[i].connected = true;
          dot.connected = true;
        }
      }
    }
  };

  const animate = (timestamp: number) => {
    if (!contextRef.current || !canvasRef.current) return;
    
    // Update time for organic movement patterns
    timeRef.current = timestamp;
    
    const ctx = contextRef.current;
    const { width, height } = sizeRef.current;
    
    // Clear canvas with full opacity
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw dots
    dotsRef.current.forEach(dot => {
      dot.update(mouseRef.current, timeRef.current, width, height);
      dot.draw(ctx);
    });
    
    // Draw minimal connecting lines
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

export default P5aBackground;
