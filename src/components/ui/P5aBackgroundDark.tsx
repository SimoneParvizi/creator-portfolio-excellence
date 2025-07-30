import React, { useEffect, useRef } from 'react';

const P5aBackgroundDark: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const canvasRectRef = useRef<DOMRect | null>(null);
  const timeRef = useRef<number>(0);
  const specialDotIndexRef = useRef<number>(-1);
  const specialDotTimerRef = useRef<number>(0);

  // White colors for dark background
  const colors = [
    'rgba(255, 255, 255, 0.4)',
    'rgba(240, 240, 240, 0.3)',
    'rgba(220, 220, 220, 0.2)',
    'rgba(200, 200, 200, 0.5)',
    'rgba(180, 180, 180, 0.6)',
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
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vx = 0;
      this.vy = 0;
      this.connected = false;
      this.speed = Math.random() * 0.2 + 0.1;
      this.angle = Math.random() * Math.PI * 2;
      this.darknessFactor = Math.random() * 0.3 + 0.7;
      this.darkening = Math.random() > 0.5;
      this.originalOpacity = parseFloat(this.color.split(',')[3]) || 0.5;
      this.currentOpacity = this.originalOpacity;
      this.opacityChangeSpeed = Math.random() * 0.005 + 0.002;
      this.isSpecial = false;
      this.specialPhase = 0;
      this.originalColor = this.color;
      this.originalSize = this.size;
      this.isSquare = false;
    }

    updateRegular(mouse: { x: number; y: number }, time: number, width: number, height: number) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = 0.8;
        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;
      }
      
      const xMovement = Math.sin(time * this.speed + this.angle) * 0.5;
      const yMovement = Math.sin(time * this.speed * 2 + this.angle) * Math.cos(time * this.speed + this.angle) * 0.5;
      
      const boundaryForce = 0.01;
      if (this.x < 50) this.vx += boundaryForce;
      if (this.x > width - 50) this.vx -= boundaryForce;
      if (this.y < 50) this.vy += boundaryForce;
      if (this.y > height - 50) this.vy -= boundaryForce;
      
      let newX = this.x + this.vx + xMovement;
      let newY = this.y + this.vy + yMovement;
      
      if (newX >= 10 && newX <= width - 10 && newY >= 10 && newY <= height - 10) {
        this.x = newX;
        this.y = newY;
      } else {
        this.x = newX;
        this.y = newY;
      }
      
      const returnSpeed = 0.015;
      this.x += (this.baseX - this.x) * returnSpeed;
      this.y += (this.baseY - this.y) * returnSpeed;
      
      this.vx *= 0.75;
      this.vy *= 0.75;
      
      if (Math.random() < 0.002) {
        this.darkening = !this.darkening;
      }
      
      if (this.darkening) {
        this.currentOpacity = Math.max(0.1, this.currentOpacity - this.opacityChangeSpeed);
      } else {
        this.currentOpacity = Math.min(this.originalOpacity, this.currentOpacity + this.opacityChangeSpeed);
      }
      
      const baseColor = this.color.substring(0, this.color.lastIndexOf(',')); 
      this.color = `${baseColor}, ${this.currentOpacity})`;
    }

    update(mouse: { x: number; y: number }, time: number, width: number, height: number) {
      if (this.isSpecial) {
        if (this.specialPhase === 1) {
          this.color = 'rgba(255, 100, 100, 0.8)'; // Red for special
          this.updateRegular(mouse, time, width, height);
        }
        else if (this.specialPhase === 2) {
          this.color = 'rgba(255, 100, 100, 0.9)';
          this.isSquare = true;
          this.size = this.originalSize * 1.5;
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
          this.updateRegular(mouse, time, width, height);
        }
      } else {
        this.updateRegular(mouse, time, width, height);
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (this.isSquare) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  }

  const createDots = () => {
    if (!canvasRef.current) return;
    
    const { width, height } = sizeRef.current;
    const dots: Dot[] = [];
    
    const gridSize = 25;
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        dots.push(new Dot(x + offsetX, y + offsetY));
      }
    }
    
    dotsRef.current = dots;
  };

  const handleResize = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    const rect = canvas.getBoundingClientRect();
    const currentSize = sizeRef.current;
    
    if (Math.abs(rect.width - currentSize.width) < 1 && Math.abs(rect.height - currentSize.height) < 1) {
      return;
    }
    
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const dpr = window.devicePixelRatio || 1;
    
    canvasRectRef.current = rect;
    
    const newWidth = rect.width;
    const newHeight = rect.height;
    
    canvas.width = newWidth * dpr;
    canvas.height = newHeight * dpr;
    
    ctx.scale(dpr, dpr);
    
    sizeRef.current = { width: newWidth, height: newHeight };
    
    createDots();
  };

  const animate = (timestamp: number) => {
    if (!contextRef.current || !canvasRef.current) return;
    
    timeRef.current = timestamp;
    
    const ctx = contextRef.current;
    const { width, height } = sizeRef.current;
    
    // Clear with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    const specialDot = dotsRef.current[specialDotIndexRef.current];
    if (specialDot && specialDot.isSpecial) {
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
    
    if (Math.random() < 0.001 && specialDotIndexRef.current === -1) {
      const randomIndex = Math.floor(Math.random() * dotsRef.current.length);
      const randomDot = dotsRef.current[randomIndex];
      randomDot.isSpecial = true;
      randomDot.specialPhase = 1;
      specialDotIndexRef.current = randomIndex;
      specialDotTimerRef.current = timestamp;
    }
    
    dotsRef.current.forEach((dot) => {
      dot.update(mouseRef.current, timeRef.current * 0.001, width, height);
      dot.draw(ctx);
    });
    
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    contextRef.current = canvasRef.current.getContext('2d');
    
    if (!contextRef.current) return;
    
    const updateMousePosition = (clientX: number, clientY: number) => {
      let rect = canvasRectRef.current;
      
      if (!rect) {
        const canvas = canvasRef.current;
        if (canvas) {
          rect = canvas.getBoundingClientRect();
          canvasRectRef.current = rect;
        } else {
          return;
        }
      }
      
      const newMousePos = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
      
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = newMousePos;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default P5aBackgroundDark;