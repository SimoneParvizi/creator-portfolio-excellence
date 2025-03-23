
import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  angle: number;
  speed: number;
  distance: number;
  size: number;
  color: string;
}

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY
      };
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    
    const initPoints = () => {
      const points: Point[] = [];
      const count = 10; // Fewer points for larger shapes
      
      for (let i = 0; i < count; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 3, // Extend beyond viewport for scrolling
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.2,
          distance: Math.random() * 50 + 50,
          size: Math.random() * 80 + 100, // Much larger sizes
          color: `rgba(${190 + Math.random() * 20}, ${190 + Math.random() * 20}, ${200 + Math.random() * 20}, ${0.03 + Math.random() * 0.05})`
        });
      }
      
      pointsRef.current = points;
    };
    
    const drawPoints = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f8f8f9');
      gradient.addColorStop(1, '#f1f1f3');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update points positions
      pointsRef.current.forEach((point, i) => {
        // Calculate the mouse influence
        const dx = point.x - mousePositionRef.current.x;
        const dy = point.y - (mousePositionRef.current.y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Move points away from mouse position
        if (distance < 300) {
          const angle = Math.atan2(dy, dx);
          const force = (300 - distance) / 10;
          point.x += Math.cos(angle) * force * 0.2;
          point.y += Math.sin(angle) * force * 0.2;
        }
        
        // Animate points in a circular motion
        point.angle += point.speed * 0.01;
        point.x += Math.cos(point.angle) * 0.5;
        point.y += Math.sin(point.angle) * 0.5;
        
        // Wrap around edges
        if (point.x < -point.size) point.x = canvas.width + point.size;
        if (point.x > canvas.width + point.size) point.x = -point.size;
        if (point.y < -point.size + scrollYRef.current) point.y = canvas.height + point.size + scrollYRef.current;
        if (point.y > canvas.height + point.size + scrollYRef.current) point.y = -point.size + scrollYRef.current;
      });
      
      // Draw abstract shapes
      drawAbstractShapes(ctx);
      
      rafRef.current = requestAnimationFrame(drawPoints);
    };
    
    const drawAbstractShapes = (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.translate(0, -scrollYRef.current);
      
      // Draw connections between points
      ctx.lineWidth = 1;
      
      // First draw filled shapes
      pointsRef.current.forEach((point, i) => {
        ctx.beginPath();
        const time = Date.now() * 0.001;
        const sizePulse = Math.sin(time + i) * 20 + 10;
        
        // Create flowing blob/abstract shape
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
          const xOffset = Math.cos(angle * 3 + time + i) * 30;
          const yOffset = Math.sin(angle * 2 + time + i * 0.5) * 30;
          const radius = point.size + xOffset + yOffset + sizePulse;
          const x = point.x + Math.cos(angle) * radius;
          const y = point.y + Math.sin(angle) * radius;
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = point.color;
        ctx.fill();
      });
      
      // Then draw connections between points
      pointsRef.current.forEach((point, i) => {
        pointsRef.current.forEach((otherPoint, j) => {
          if (i !== j) {
            const dx = point.x - otherPoint.x;
            const dy = point.y - otherPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 400) {
              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(otherPoint.x, otherPoint.y);
              const opacity = (400 - distance) / 4000;
              ctx.strokeStyle = `rgba(180, 180, 190, ${opacity})`;
              ctx.stroke();
            }
          }
        });
      });
      
      ctx.restore();
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    drawPoints();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-80"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BackgroundEffect;
