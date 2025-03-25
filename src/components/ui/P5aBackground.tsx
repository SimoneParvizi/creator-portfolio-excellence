import React, { useEffect, useRef } from 'react';

const P5aBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const timeRef = useRef<number>(0);
  const specialDotIndexRef = useRef<number>(-1);
  const specialDotTimerRef = useRef<number>(0);

  // Expanded color palette with darker gray options
  const colors = [
    'rgba(200, 200, 200, 0.4)',
    'rgba(180, 180, 180, 0.3)',
    'rgba(160, 160, 160, 0.2)',
    'rgba(120, 120, 120, 0.5)', // Darker option
    'rgba(100, 100, 100, 0.6)', // Even darker option
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
    darknessFactor: number;
    darkening: boolean;
    originalOpacity: number;
    currentOpacity: number;
    opacityChangeSpeed: number;
    isSpecial: boolean;
    specialPhase: number; // 0: normal, 1: turning red, 2: still, 3: returning to normal
    originalColor: string;
    
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = Math.random() * 1 + 0.5; // Keep the small dots
      
      // Extract color values for opacity manipulation
      const colorIndex = Math.floor(Math.random() * colors.length);
      this.color = colors[colorIndex];
      this.originalColor = this.color;
      
      // Parse the original opacity from the rgba string
      const opacityMatch = this.color.match(/[\d.]+(?=\))/);
      this.originalOpacity = opacityMatch ? parseFloat(opacityMatch[0]) : 0.3;
      this.currentOpacity = this.originalOpacity;
      
      this.vx = 0;
      this.vy = 0;
      this.connected = false; // Used to track if dot is in a line
      this.speed = Math.random() * 0.0005 + 0.0002; // Very slow movement speed
      this.angle = Math.random() * Math.PI * 2; // Random initial angle
      
      // Initialize darkness transition properties
      this.darknessFactor = 1;
      this.darkening = Math.random() > 0.7; // 30% chance to start darkening
      this.opacityChangeSpeed = Math.random() * 0.002 + 0.001; // Speed of opacity change
      
      // Special dot properties
      this.isSpecial = false;
      this.specialPhase = 0;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      // Determine color based on special status
      let displayColor;
      
      if (this.isSpecial) {
        if (this.specialPhase === 1) {
          // Transitioning to red
          displayColor = `rgba(234, 56, 76, ${this.currentOpacity})`;
        } else if (this.specialPhase === 2) {
          // Fully red and still
          displayColor = `rgba(234, 56, 76, 0.8)`;
        } else if (this.specialPhase === 3) {
          // Transitioning back to normal
          displayColor = `rgba(234, 56, 76, ${this.currentOpacity})`;
        } else {
          // Normal behavior but red
          const baseColor = this.color.replace(/[\d.]+(?=\))/, this.currentOpacity.toString());
          displayColor = baseColor;
        }
      } else {
        // Regular dot with current opacity
        const baseColor = this.color.replace(/[\d.]+(?=\))/, this.currentOpacity.toString());
        displayColor = baseColor;
      }
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.isSpecial ? this.size * 1.5 : this.size, 0, Math.PI * 2);
      ctx.fillStyle = displayColor;
      ctx.fill();
    }
    
    update(mouse: { x: number, y: number }, time: number, width: number, height: number) {
      // Different behavior based on special status and phase
      if (this.isSpecial) {
        if (this.specialPhase === 1) {
          // Phase 1: Turning red and slowing down
          this.color = 'rgba(234, 56, 76, 0.8)'; // Red color
          
          // Gradually slow down
          this.vx *= 0.95;
          this.vy *= 0.95;
          
          // Minimal movement based on time
          const slowFactor = 0.3; // Reduced movement
          const xMovement = Math.sin(time * this.speed * slowFactor + this.angle) * 0.2;
          const yMovement = Math.sin(time * this.speed * 2 * slowFactor + this.angle) * Math.cos(time * this.speed * slowFactor + this.angle) * 0.2;
          
          this.x += this.vx + xMovement;
          this.y += this.vy + yMovement;
          
          // Update opacity to become more visible
          this.currentOpacity = Math.min(0.8, this.currentOpacity + 0.01);
        }
        else if (this.specialPhase === 2) {
          // Phase 2: Still and fully red
          // Almost no movement
          this.vx = 0;
          this.vy = 0;
          
          // Minimal wiggle
          const tinyMovement = Math.sin(time * 0.001) * 0.05;
          this.x += tinyMovement;
          this.y += tinyMovement;
        }
        else if (this.specialPhase === 3) {
          // Phase 3: Returning to normal
          // Gradually restore original color
          this.color = this.originalColor;
          
          // Start regaining normal movement
          const recoveryFactor = 0.5;
          const xMovement = Math.sin(time * this.speed * recoveryFactor + this.angle) * 0.3;
          const yMovement = Math.sin(time * this.speed * 2 * recoveryFactor + this.angle) * Math.cos(time * this.speed * recoveryFactor + this.angle) * 0.3;
          
          this.x += this.vx + xMovement;
          this.y += this.vy + yMovement;
          
          // Update opacity to return to original
          this.currentOpacity = Math.max(this.originalOpacity, this.currentOpacity - 0.01);
        }
        else {
          // Regular behavior for special dot (when not in special phases)
          this.updateRegular(mouse, time, width, height);
        }
      } else {
        // Regular behavior for normal dots
        this.updateRegular(mouse, time, width, height);
      }
      
      // Reset connected state for this frame
      this.connected = false;
    }
    
    updateRegular(mouse: { x: number, y: number }, time: number, width: number, height: number) {
      // Enhanced mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 80; // Increased influence radius
      
      if (distance < maxDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (maxDistance - distance) / maxDistance;
        
        // Stronger movement away from mouse
        this.vx -= Math.cos(angle) * force * 0.1;
        this.vy -= Math.sin(angle) * force * 0.1;
        
        // Dots near the mouse get darker temporarily
        if (distance < 30) {
          this.currentOpacity = Math.min(0.8, this.currentOpacity + 0.05);
        }
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
      
      // Random opacity transitions
      if (Math.random() < 0.002) { // Small chance to toggle darkening state
        this.darkening = !this.darkening;
      }
      
      // Update opacity based on darkening state
      if (this.darkening) {
        this.currentOpacity = Math.min(0.8, this.currentOpacity + this.opacityChangeSpeed);
        if (this.currentOpacity >= 0.8) {
          this.darkening = false;
        }
      } else {
        this.currentOpacity = Math.max(this.originalOpacity, this.currentOpacity - this.opacityChangeSpeed);
        if (this.currentOpacity <= this.originalOpacity) {
          this.darkening = Math.random() > 0.95; // 5% chance to start darkening again
        }
      }
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
          // Modify line opacity based on current dot opacities
          const avgOpacity = (dots[i].currentOpacity + dot.currentOpacity) / 2;
          const opacity = (1 - (distance / maxDistance)) * avgOpacity;
          
          ctx.strokeStyle = `rgba(180, 180, 180, ${opacity * 0.3})`; // Lines get darker too
          ctx.lineWidth = 0.2; // Keep extremely thin lines
          
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

  const updateSpecialDot = (timestamp: number) => {
    const dots = dotsRef.current;
    
    // Handle special dot
    if (specialDotIndexRef.current === -1 && Math.random() < 0.001) {
      // Randomly select a dot to become special (very low probability)
      specialDotIndexRef.current = Math.floor(Math.random() * dots.length);
      specialDotTimerRef.current = timestamp;
      
      // Initialize the selected dot as special
      const specialDot = dots[specialDotIndexRef.current];
      specialDot.isSpecial = true;
      specialDot.specialPhase = 1; // Start phase 1 (turning red)
    }
    
    // If we have a special dot, update its state based on time
    if (specialDotIndexRef.current !== -1) {
      const specialDot = dots[specialDotIndexRef.current];
      const elapsed = timestamp - specialDotTimerRef.current;
      
      if (specialDot.specialPhase === 1 && elapsed > 3000) {
        // After 3 seconds, transition to phase 2 (still)
        specialDot.specialPhase = 2;
        specialDotTimerRef.current = timestamp;
      }
      else if (specialDot.specialPhase === 2 && elapsed > 5000) {
        // After 5 seconds, transition to phase 3 (returning to normal)
        specialDot.specialPhase = 3;
        specialDotTimerRef.current = timestamp;
      }
      else if (specialDot.specialPhase === 3 && elapsed > 3000) {
        // After 3 more seconds, complete transition back to normal
        specialDot.isSpecial = false;
        specialDot.specialPhase = 0;
        specialDot.color = specialDot.originalColor;
        specialDotIndexRef.current = -1; // Reset special dot reference
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
    
    // Update special dot state
    updateSpecialDot(timestamp);
    
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
