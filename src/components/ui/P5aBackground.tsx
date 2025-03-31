
import React, { useEffect, useRef } from 'react';

interface P5aBackgroundProps {
  isTransitioning?: boolean;
}

const P5aBackground: React.FC<P5aBackgroundProps> = ({ isTransitioning = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const timeRef = useRef<number>(0);
  const specialDotIndexRef = useRef<number>(-1);
  const specialDotTimerRef = useRef<number>(0);
  const speedFactorRef = useRef<number>(1);
  const initializedRef = useRef<boolean>(false);
  const transitionDirectionRef = useRef<number>(1); // 1 for right, -1 for left

  useEffect(() => {
    if (isTransitioning) {
      speedFactorRef.current = 5; // Speed up dots during transition
      transitionDirectionRef.current = -1; // Move dots to the left during transitions
      console.log('Speeding up dots for transition and moving left');
    } else {
      // Will gradually slow down in the animation loop
      console.log('Will gradually slow down dots after transition');
    }
  }, [isTransitioning]);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

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
    specialPhase: number;
    originalColor: string;
    originalSize: number;
    isSquare: boolean;
    
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = Math.random() * 1 + 0.5;
      this.originalSize = this.size;
      
      const colorIndex = Math.floor(Math.random() * colors.length);
      this.color = colors[colorIndex];
      this.originalColor = this.color;
      
      const opacityMatch = this.color.match(/[\d.]+(?=\))/);
      this.originalOpacity = opacityMatch ? parseFloat(opacityMatch[0]) : 0.3;
      this.currentOpacity = this.originalOpacity;
      
      this.vx = 0;
      this.vy = 0;
      this.connected = false;
      this.speed = Math.random() * 0.0005 + 0.0002;
      this.angle = Math.random() * Math.PI * 2;
      
      this.darknessFactor = 1;
      this.darkening = Math.random() > 0.7;
      this.opacityChangeSpeed = Math.random() * 0.002 + 0.001;
      
      this.isSpecial = false;
      this.specialPhase = 0;
      this.isSquare = false;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      let displayColor;
      
      if (this.isSpecial) {
        if (this.specialPhase === 1) {
          displayColor = `rgba(234, 56, 76, ${this.currentOpacity})`;
        } else if (this.specialPhase === 2) {
          displayColor = `rgba(234, 56, 76, 0.8)`;
        } else if (this.specialPhase === 3) {
          displayColor = `rgba(234, 56, 76, ${this.currentOpacity})`;
        } else {
          const baseColor = this.color.replace(/[\d.]+(?=\))/, this.currentOpacity.toString());
          displayColor = baseColor;
        }
      } else {
        const baseColor = this.color.replace(/[\d.]+(?=\))/, this.currentOpacity.toString());
        displayColor = baseColor;
      }
      
      if (this.isSquare) {
        const squareSize = this.size * 2;
        ctx.fillStyle = displayColor;
        ctx.fillRect(this.x - squareSize/2, this.y - squareSize/2, squareSize, squareSize);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = displayColor;
        ctx.fill();
      }
    }
    
    update(mouse: { x: number, y: number }, time: number, width: number, height: number, speedFactor: number = 1, transitionDirection: number = 1) {
      if (this.isSpecial) {
        if (this.specialPhase === 1) {
          this.color = 'rgba(234, 56, 76, 0.8)';
          this.vx *= 0.95;
          this.vy *= 0.95;
          
          const slowFactor = 0.3;
          const xMovement = Math.sin(time * this.speed * slowFactor + this.angle) * 0.2;
          const yMovement = Math.sin(time * this.speed * 2 * slowFactor + this.angle) * Math.cos(time * this.speed * slowFactor + this.angle) * 0.2;
          
          this.x += this.vx + xMovement;
          this.y += this.vy + yMovement;
          
          this.currentOpacity = Math.min(0.8, this.currentOpacity + 0.01);
        }
        else if (this.specialPhase === 2) {
          this.vx = 0;
          this.vy = 0;
          
          const tinyMovement = Math.sin(time * 0.001) * 0.05;
          this.x += tinyMovement;
          this.y += tinyMovement;
          
          this.isSquare = true;
          
          this.size = this.originalSize * 1.2;
        }
        else if (this.specialPhase === 3) {
          this.color = this.originalColor;
          this.isSquare = false;
          
          this.size = this.originalSize + (this.size - this.originalSize) * 0.9;
          
          const recoveryFactor = 0.5;
          const xMovement = Math.sin(time * this.speed * recoveryFactor + this.angle) * 0.3;
          const yMovement = Math.sin(time * this.speed * 2 * recoveryFactor + this.angle) * Math.cos(time * this.speed * recoveryFactor + this.angle) * 0.3;
          
          this.x += this.vx + xMovement;
          this.y += this.vy + yMovement;
          
          this.currentOpacity = Math.max(this.originalOpacity, this.currentOpacity - 0.01);
        }
        else {
          this.updateRegular(mouse, time, width, height, speedFactor, transitionDirection);
        }
      } else {
        this.updateRegular(mouse, time, width, height, speedFactor, transitionDirection);
      }
      
      this.connected = false;

      // Handle screen wrap-around for continuous flow effect
      if (this.x < -10) {
        this.x = width + 10;
      } else if (this.x > width + 10) {
        this.x = -10;
      }

      if (this.y < -10) {
        this.y = height + 10;
      } else if (this.y > height + 10) {
        this.y = -10;
      }
    }
    
    updateRegular(mouse: { x: number, y: number }, time: number, width: number, height: number, speedFactor: number = 1, transitionDirection: number = 1) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 120;
      
      if (distance < maxDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (maxDistance - distance) / maxDistance;
        
        this.vx -= Math.cos(angle) * force * 0.4 * speedFactor;
        this.vy -= Math.sin(angle) * force * 0.4 * speedFactor;
        
        if (distance < 50) {
          this.currentOpacity = Math.min(0.9, this.currentOpacity + 0.08);
          this.size = this.originalSize;
        }
      }
      
      // Stronger transition effect - multiply transitionSpeed for more visible movement
      const transitionSpeed = 4.0 * speedFactor * transitionDirection;
      this.vx += transitionSpeed * 0.15; // Increased velocity in transition direction
      
      const xMovement = Math.sin(time * this.speed * speedFactor + this.angle) * 0.5 * speedFactor;
      const yMovement = Math.sin(time * this.speed * 2 * speedFactor + this.angle) * Math.cos(time * this.speed * speedFactor + this.angle) * 0.5 * speedFactor;
      
      this.x += this.vx + xMovement;
      this.y += this.vy + yMovement;
      
      // During transition, reduce the "return to base" behavior
      const returnStrength = speedFactor > 2 ? 0.0005 : 0.01;
      this.x += (this.baseX - this.x) * returnStrength * speedFactor;
      this.y += (this.baseY - this.y) * returnStrength * speedFactor;
      
      // Slower damping during transitions to maintain momentum
      const dampingFactor = speedFactor > 1 ? 0.92 : 0.8;
      this.vx *= dampingFactor;
      this.vy *= dampingFactor;
      
      if (Math.random() < 0.002 * speedFactor) {
        this.darkening = !this.darkening;
      }
      
      if (this.darkening) {
        this.currentOpacity = Math.min(0.8, this.currentOpacity + this.opacityChangeSpeed * speedFactor);
        if (this.currentOpacity >= 0.8) {
          this.darkening = false;
        }
      } else {
        this.currentOpacity = Math.max(this.originalOpacity, this.currentOpacity - this.opacityChangeSpeed * speedFactor);
        if (this.currentOpacity <= this.originalOpacity) {
          this.darkening = Math.random() > 0.95;
        }
      }
    }
  }

  const createDots = () => {
    if (!canvasRef.current || initializedRef.current) return;
    
    const { width, height } = sizeRef.current;
    const dots: Dot[] = [];
    
    const gridSize = 30;
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const randX = x + (Math.random() * 10 - 5);
        const randY = y + (Math.random() * 10 - 5);
        dots.push(new Dot(randX, randY));
      }
    }
    
    dotsRef.current = dots;
    initializedRef.current = true;
  };

  const handleResize = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    sizeRef.current = {
      width: rect.width,
      height: rect.height
    };
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    if (!initializedRef.current || dotsRef.current.length === 0) {
      createDots();
    }
  };

  const drawLines = (ctx: CanvasRenderingContext2D, dots: Dot[]) => {
    const maxDistance = 40;
    
    for (let i = 0; i < dots.length; i++) {
      let connections = 0;
      const connectedDots = [];
      
      for (let j = 0; j < dots.length; j++) {
        if (i === j) continue;
        
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          connectedDots.push({ dot: dots[j], distance });
        }
      }
      
      connectedDots.sort((a, b) => a.distance - b.distance);
      const nearest = connectedDots.slice(0, 2);
      
      for (const { dot, distance } of nearest) {
        if (!dots[i].connected || !dot.connected) {
          const avgOpacity = (dots[i].currentOpacity + dot.currentOpacity) / 2;
          const opacity = (1 - (distance / maxDistance)) * avgOpacity;
          
          ctx.strokeStyle = `rgba(180, 180, 180, ${opacity * 0.3})`;
          ctx.lineWidth = 0.2;
          
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dot.x, dot.y);
          ctx.stroke();
          
          dots[i].connected = true;
          dot.connected = true;
        }
      }
    }
  };

  const updateSpecialDot = (timestamp: number) => {
    const dots = dotsRef.current;
    
    if (specialDotIndexRef.current === -1 && Math.random() < 0.001) {
      specialDotIndexRef.current = Math.floor(Math.random() * dots.length);
      specialDotTimerRef.current = timestamp;
      
      const specialDot = dots[specialDotIndexRef.current];
      specialDot.isSpecial = true;
      specialDot.specialPhase = 1;
      specialDot.originalSize = specialDot.size;
    }
    
    if (specialDotIndexRef.current !== -1) {
      const specialDot = dots[specialDotIndexRef.current];
      const elapsed = timestamp - specialDotTimerRef.current;
      
      if (specialDot.specialPhase === 1 && elapsed > 3000) {
        specialDot.specialPhase = 2;
        specialDotTimerRef.current = timestamp;
      }
      else if (specialDot.specialPhase === 2 && elapsed > 5000) {
        specialDot.specialPhase = 3;
        specialDotTimerRef.current = timestamp;
      }
      else if (specialDot.specialPhase === 3 && elapsed > 3000) {
        specialDot.isSpecial = false;
        specialDot.specialPhase = 0;
        specialDot.color = specialDot.originalColor;
        specialDot.isSquare = false;
        specialDot.size = specialDot.originalSize;
        specialDotIndexRef.current = -1;
      }
    }
  };

  const animate = (timestamp: number) => {
    if (!contextRef.current || !canvasRef.current) return;
    
    timeRef.current = timestamp;
    
    const ctx = contextRef.current;
    const { width, height } = sizeRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    updateSpecialDot(timestamp);
    
    dotsRef.current.forEach(dot => {
      dot.update(mouseRef.current, timeRef.current, width, height, speedFactorRef.current, transitionDirectionRef.current);
      dot.draw(ctx);
    });
    
    drawLines(ctx, dotsRef.current);
    
    // Slower decay for the speed factor to make the transition more noticeable
    if (speedFactorRef.current > 1.0) {
      speedFactorRef.current = Math.max(1.0, speedFactorRef.current * 0.98);
    } else {
      transitionDirectionRef.current = 1; // Reset direction when back to normal speed
    }
    
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    contextRef.current = canvasRef.current.getContext('2d');
    
    if (!contextRef.current) return;
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    rafRef.current = requestAnimationFrame(animate);
    
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
