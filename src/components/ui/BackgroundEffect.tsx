
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
    
    console.log('BackgroundEffect initialized');
    
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
      canvas.height = document.documentElement.scrollHeight; // Use full document height
      console.log(`Canvas resized: ${canvas.width}x${canvas.height}`);
      drawEffect(); // Redraw on resize
    };
    
    // Draw the background effect with a dot-based semicircle pattern
    const drawEffect = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set background
      ctx.fillStyle = 'rgba(248, 248, 249, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate the center and radius of the semicircle
      const time = Date.now() * 0.0001; // Time factor for subtle movement
      const mouseFactor = 0.01; // How much the mouse influences the position
      const mouseOffsetX = (mousePositionRef.current.x - canvas.width / 2) * mouseFactor;
      const mouseOffsetY = (mousePositionRef.current.y - canvas.height / 2) * mouseFactor;
      
      // Calculate center with subtle movement
      const centerX = canvas.width * 0.75 + Math.sin(time) * 10 + mouseOffsetX;
      const centerY = canvas.height * 0.3 + Math.cos(time) * 5 + mouseOffsetY - scrollYRef.current * 0.2;
      
      // Calculate radius with very subtle pulsing
      const baseRadius = Math.max(canvas.width, canvas.height) * 0.7;
      const radius = baseRadius + Math.sin(time * 1.5) * (baseRadius * 0.01);
      
      // Draw the dots in a semicircle pattern
      drawDotSemicircle(ctx, centerX, centerY, radius, time);
      
      // Continue animation
      rafRef.current = requestAnimationFrame(drawEffect);
    };
    
    // Draw a semicircle made of dots
    const drawDotSemicircle = (
      ctx: CanvasRenderingContext2D, 
      centerX: number, 
      centerY: number, 
      radius: number, 
      time: number
    ) => {
      // Semicircle parameters
      const totalDots = 20000; // Use many dots for the grainy effect
      const dotMaxSize = 1.5; // Maximum dot size
      const dotMinSize = 0.5; // Minimum dot size
      
      // We'll use a density function to concentrate dots along the semicircle edge
      const densityFactor = 0.5; // Controls how concentrated dots are at the edge
      
      ctx.save();
      
      for (let i = 0; i < totalDots; i++) {
        // Create a random angle in the semicircle (0 to π)
        const angle = Math.random() * Math.PI;
        
        // Create a random distance from center, with higher concentration near the edge
        const distanceRatio = Math.pow(Math.random(), densityFactor);
        const distance = radius * distanceRatio;
        
        // Calculate position with slight movement based on time
        const xMovement = Math.sin(time * 2 + i * 0.0001) * 2;
        const yMovement = Math.cos(time * 3 + i * 0.0001) * 2;
        
        const x = centerX + Math.cos(angle) * distance + xMovement;
        const y = centerY + Math.sin(angle) * distance + yMovement;
        
        // Only draw if within canvas bounds
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          // Dot size varies based on distance from edge and time
          const sizeFactor = 1 - Math.abs(distanceRatio - 0.9);
          const size = dotMinSize + sizeFactor * dotMaxSize;
          
          // Dot opacity also varies
          const baseOpacity = 0.3; // Higher base opacity
          const opacityVariation = 0.5;
          const opacity = Math.min(baseOpacity * (1 + Math.sin(time * 5 + i * 0.01) * opacityVariation), 1);
          
          // Draw the dot
          ctx.fillStyle = `rgba(230, 230, 235, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
      
      // Create subtle glow at the edge of the semicircle
      addSemicircleGlow(ctx, centerX, centerY, radius);
    };
    
    // Add a subtle glow to the edge of the semicircle
    const addSemicircleGlow = (
      ctx: CanvasRenderingContext2D, 
      centerX: number, 
      centerY: number, 
      radius: number
    ) => {
      const gradientWidth = radius * 0.1;
      
      // Create a gradient along the semicircle edge
      const gradient = ctx.createLinearGradient(
        centerX - radius, centerY, 
        centerX - radius + gradientWidth, centerY
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI, true);
      ctx.arc(centerX, centerY, radius - gradientWidth, Math.PI, 0, false);
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Start animation
    drawEffect();
    
    console.log('BackgroundEffect animation started');
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      console.log('BackgroundEffect cleaned up');
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10
      }}
    />
  );
};

export default BackgroundEffect;
