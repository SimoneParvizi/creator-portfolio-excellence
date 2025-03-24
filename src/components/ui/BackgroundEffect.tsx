
import React, { useEffect, useRef } from 'react';

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY
      };
    };

    // Track scroll position
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3; // Extended canvas height for scrolling
      drawSemicircle(); // Redraw on resize
    };
    
    // Draw the semicircular effect
    const drawSemicircle = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create subtle background
      ctx.fillStyle = 'rgba(248, 248, 249, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Configuration for the semicircle
      const time = Date.now() * 0.0002; // Time factor for animation
      const totalCircles = 3; // Number of semicircles
      
      // Draw multiple semicircles with different sizes and subtle movements
      for (let i = 0; i < totalCircles; i++) {
        const radiusBase = Math.min(canvas.width, canvas.height) * (0.7 + i * 0.2);
        
        // Apply subtle movement based on time and mouse position
        const mouseFactor = 0.05; // How much the mouse influences the position
        const mouseOffsetX = (mousePositionRef.current.x - canvas.width / 2) * mouseFactor;
        const mouseOffsetY = (mousePositionRef.current.y - canvas.height / 2) * mouseFactor;
        
        // Calculate center of the semicircle with subtle movement
        const centerX = canvas.width * 0.5 + Math.sin(time + i) * 20 + mouseOffsetX;
        const centerY = canvas.height * 0.3 + Math.cos(time * 0.8 + i) * 15 + mouseOffsetY - scrollYRef.current * 0.5;
        
        // Calculate radius with subtle pulsing
        const radius = radiusBase + Math.sin(time * 1.5) * (radiusBase * 0.03);
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        // Set gradient colors with varying opacity based on index
        const baseOpacity = 0.03 - (i * 0.005); // Decreasing opacity for each subsequent circle
        gradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity * 2})`);
        gradient.addColorStop(0.7, `rgba(240, 240, 245, ${baseOpacity})`);
        gradient.addColorStop(1, 'rgba(240, 240, 245, 0)');
        
        // Draw the semicircle
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI, true);
        
        // Add subtle distortion to the edge
        const distortionPoints = 10;
        const distortionAmount = 5 + Math.sin(time * 2) * 3;
        
        for (let j = 0; j <= distortionPoints; j++) {
          const angle = Math.PI + (j / distortionPoints) * Math.PI;
          const distX = Math.cos(angle) * radius;
          const distY = Math.sin(angle) * radius;
          
          // Add subtle noise to the edge
          const noise = Math.sin(angle * 5 + time * 3) * distortionAmount;
          
          const x = centerX + distX + noise;
          const y = centerY + distY + noise;
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Optional: Add a very subtle glow
        ctx.shadowColor = 'rgba(255, 255, 255, 0.1)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Add a very subtle stroke
        ctx.strokeStyle = 'rgba(230, 230, 235, 0.05)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
      
      // Add extremely subtle noise pattern
      addNoisePattern(ctx, canvas.width, canvas.height);
      
      // Continue animation
      rafRef.current = requestAnimationFrame(drawSemicircle);
    };
    
    // Add subtle noise pattern
    const addNoisePattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Only render noise in the visible area
      const visibleHeight = window.innerHeight;
      const startY = Math.max(0, scrollYRef.current - 100);
      const endY = Math.min(height, scrollYRef.current + visibleHeight + 100);
      
      // Very sparse noise for subtle texture
      const noisePoints = 500;
      
      ctx.save();
      ctx.globalAlpha = 0.02; // Very subtle
      
      for (let i = 0; i < noisePoints; i++) {
        const x = Math.random() * width;
        const y = startY + Math.random() * (endY - startY);
        
        // Vary size based on position for a more natural feel
        const size = Math.random() * 1.5 + 0.5;
        
        ctx.fillStyle = `rgba(240, 240, 245, ${Math.random() * 0.08})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Start animation
    drawSemicircle();
    
    // Cleanup
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
      className="fixed top-0 left-0 w-full h-screen -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BackgroundEffect;
