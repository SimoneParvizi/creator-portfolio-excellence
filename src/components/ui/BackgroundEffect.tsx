
import React, { useEffect, useRef } from 'react';

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    console.log('BackgroundEffect initialized');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      console.log(`Canvas resized: ${canvas.width}x${canvas.height}`);
    };
    
    // Update scroll position reference
    const updateScrollPosition = () => {
      scrollYRef.current = window.scrollY;
    };
    
    // Initialize particles
    const particleCount = 5000; // Adjusted for performance vs. density
    const particles: Particle[] = [];
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      opacity: number;
      wavePhase: number;
      waveSpeed: number;
      theta: number;
      phi: number;
      radius: number;
      originalX: number;
      originalY: number;
      originalZ: number;
    }
    
    // Create particles on a half-sphere
    const createParticles = () => {
      particles.length = 0;
      
      // Half-sphere parameters
      // Position the center at the right edge of the screen for horizontal half-sphere
      const centerX = canvas.width;
      const centerY = canvas.height * 0.5;
      const radius = Math.min(canvas.width, canvas.height) * 0.5;
      
      for (let i = 0; i < particleCount; i++) {
        // Use spherical coordinates to place particles on a half-sphere
        // Phi ranges from PI/2 to PI for right-facing half sphere
        const phi = (Math.PI / 2) + (Math.random() * Math.PI / 2);
        const theta = Math.random() * Math.PI * 2;
        
        // Convert spherical to cartesian coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Project to 2D - flip x and z to make half-sphere face left from right edge
        const projectedX = centerX + x;
        const projectedY = centerY + y;
        
        // Higher opacity for better visibility
        const opacity = 0.4 + Math.random() * 0.6;
        
        // Wave parameters
        const wavePhase = Math.random() * Math.PI * 2;
        const waveSpeed = 0.01 + Math.random() * 0.02;
        
        particles.push({
          x: projectedX,
          y: projectedY,
          size: 1.5 + Math.random() * 2.5, // Larger sizes for better visibility
          color: `rgba(255, 255, 255, ${opacity})`,
          opacity,
          wavePhase,
          waveSpeed,
          theta,
          phi,
          radius,
          originalX: x,
          originalY: y,
          originalZ: z
        });
      }
    };
    
    // Animate particles
    const animate = () => {
      // Use a semi-transparent clear to create subtle trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get the current time for animation
      const time = Date.now() * 0.001;
      const scrollY = scrollYRef.current;
      
      // Update and draw particles
      particles.forEach(particle => {
        // Apply wave motion effect from bottom to top
        const waveOffset = Math.sin(time * particle.waveSpeed + particle.wavePhase) * 10;
        
        // Project from 3D to 2D considering the wave effect
        const centerX = canvas.width;
        const centerY = canvas.height * 0.5;
        
        // Recreate 3D position with wave motion
        const x = particle.originalX;
        // Apply wave to Y axis (up/down)
        const y = particle.originalY + waveOffset;
        const z = particle.originalZ;
        
        // Add parallax effect based on scroll position
        const scrollFactor = 0.2;
        const scrollOffset = scrollY * scrollFactor;
        
        // Project to 2D with parallax
        const projectedX = centerX + x;
        const projectedY = centerY + y - scrollOffset;
        
        // Only draw if within canvas bounds with a small margin
        if (projectedX >= -20 && projectedX <= canvas.width + 20 && 
            projectedY >= -20 && projectedY <= canvas.height + 20) {
          
          // Adjust opacity based on z position for depth effect
          const depthFactor = (z / particle.radius) * 0.5 + 0.5;
          const dynamicOpacity = particle.opacity * depthFactor;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${dynamicOpacity})`;
          ctx.fill();
        }
      });
      
      // Add a subtle glow effect
      const centerX = canvas.width;
      const centerY = canvas.height * 0.5;
      const radius = Math.min(canvas.width, canvas.height) * 0.5;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 1.2
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.02)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    setCanvasDimensions();
    createParticles();
    animate();
    
    // Event listeners
    window.addEventListener('resize', () => {
      setCanvasDimensions();
      createParticles();
    });
    
    window.addEventListener('scroll', updateScrollPosition);
    
    console.log('Animation started with', particles.length, 'particles');
    
    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('scroll', updateScrollPosition);
      console.log('BackgroundEffect cleaned up');
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
        zIndex: -1,
        pointerEvents: 'none',
        background: 'rgba(0, 0, 0, 0.97)', // Dark background for contrast
      }}
    />
  );
};

export default BackgroundEffect;
