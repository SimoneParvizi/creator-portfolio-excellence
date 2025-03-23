
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
      const count = 8; // Fewer points for larger shapes
      
      for (let i = 0; i < count; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 3, // Extend beyond viewport for scrolling
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.2,
          distance: Math.random() * 50 + 50,
          size: Math.random() * 120 + 120, // Even larger sizes
          color: getRandomColor(0.15 + Math.random() * 0.15) // More opacity for visibility
        });
      }
      
      pointsRef.current = points;
    };

    const getRandomColor = (opacity: number) => {
      // Using more masculine colors with greater variety and vibrance
      const colors = [
        `rgba(32, 85, 138, ${opacity})`,    // Steel Blue
        `rgba(45, 68, 105, ${opacity})`,    // Navy Blue
        `rgba(73, 73, 95, ${opacity})`,     // Slate Gray
        `rgba(41, 50, 65, ${opacity})`,     // Dark Blue Gray
        `rgba(89, 65, 65, ${opacity})`,     // Rustic Brown
        `rgba(30, 95, 116, ${opacity})`,    // Teal
        `rgba(76, 44, 87, ${opacity})`,     // Deep Purple
        `rgba(107, 45, 45, ${opacity})`,    // Burgundy Red
        `rgba(34, 87, 68, ${opacity})`,     // Forest Green
        `rgba(92, 58, 36, ${opacity})`,     // Deep Brown
        `rgba(74, 35, 90, ${opacity})`,     // Rich Purple
        `rgba(37, 93, 102, ${opacity})`,    // Deep Teal
        `rgba(125, 65, 42, ${opacity})`,    // Rust
        `rgba(53, 92, 80, ${opacity})`,     // Pine Green
        `rgba(86, 47, 65, ${opacity})`,     // Merlot
      ];
      return colors[Math.floor(Math.random() * colors.length)];
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
        
        // Move points away from mouse position with stronger effect
        if (distance < 400) {
          const angle = Math.atan2(dy, dx);
          const force = (400 - distance) / 8; // Increased force
          point.x += Math.cos(angle) * force * 0.3;
          point.y += Math.sin(angle) * force * 0.3;
        }
        
        // Animate points in a circular motion
        point.angle += point.speed * 0.01;
        point.x += Math.cos(point.angle) * 0.8; // Increased movement
        point.y += Math.sin(point.angle) * 0.8;
        
        // Wrap around edges
        if (point.x < -point.size) point.x = canvas.width + point.size;
        if (point.x > canvas.width + point.size) point.x = -point.size;
        if (point.y < -point.size + scrollYRef.current) point.y = canvas.height + point.size + scrollYRef.current;
        if (point.y > canvas.height + point.size + scrollYRef.current) point.y = -point.size + scrollYRef.current;
      });
      
      // Draw abstract shapes with enhanced visibility
      drawAbstractShapes(ctx);
      
      rafRef.current = requestAnimationFrame(drawPoints);
    };
    
    const drawAbstractShapes = (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.translate(0, -scrollYRef.current);
      
      // First draw filled shapes with more pronounced appearance
      pointsRef.current.forEach((point, i) => {
        ctx.beginPath();
        const time = Date.now() * 0.0005; // Slowed down for smoother morphing
        const sizePulse = Math.sin(time + i) * 30 + 20; // More pronounced pulse
        
        // Create flowing blob/abstract shape with more complex morphing
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
          const xOffset = Math.cos(angle * 3 + time + i) * 40; // Larger offsets
          const yOffset = Math.sin(angle * 2 + time + i * 0.5) * 40;
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

        // Add a subtle stroke for better definition
        ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      
      // Then draw connections between points with higher visibility
      pointsRef.current.forEach((point, i) => {
        pointsRef.current.forEach((otherPoint, j) => {
          if (i !== j) {
            const dx = point.x - otherPoint.x;
            const dy = point.y - otherPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 500) { // Increased connection distance
              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(otherPoint.x, otherPoint.y);
              const opacity = (500 - distance) / 3000;
              ctx.strokeStyle = `rgba(70, 72, 82, ${opacity * 2})`; // More visible lines with masculine color
              ctx.lineWidth = 2; // Thicker lines
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
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-90"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BackgroundEffect;
