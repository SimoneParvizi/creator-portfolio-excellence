
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
    const particleCount = 7000; // Increased for higher density
    const particles: Particle[] = [];
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
      parallaxFactor: number;
      directionX: number;
      directionY: number;
      originalX: number;
      originalY: number;
      driftRadius: number;
      driftAngle: number;
      driftSpeed: number;
    }
    
    // Create particle distribution
    const createParticles = () => {
      particles.length = 0;
      
      // Create a circular/curved gradient field of particles
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.4;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8; // Increased radius
      
      for (let i = 0; i < particleCount; i++) {
        // Use a mix of spiral and circular pattern for distribution
        const angle = Math.random() * Math.PI * 2;
        // Create a distance distribution that has higher density in specific areas
        const distanceFactor = Math.pow(Math.random(), 0.7); // Power determines concentration
        const distance = maxRadius * distanceFactor;
        
        // Increased opacity for better visibility
        const opacity = 0.5 + Math.random() * 0.5; // Higher baseline opacity
        const parallaxFactor = 0.2 + Math.random() * 0.4; // How much the particle responds to scroll
        
        // Create drift parameters
        const driftRadius = 1 + Math.random() * 3; // How far the particle can drift
        const driftAngle = Math.random() * Math.PI * 2; // Starting angle for drift
        const driftSpeed = 0.0008 + Math.random() * 0.001; // Speed of drift
        
        const originalX = centerX + Math.cos(angle) * distance;
        const originalY = centerY + Math.sin(angle) * distance;
        
        particles.push({
          x: originalX,
          y: originalY,
          originalX,
          originalY,
          size: 1 + Math.random() * 2, // Increased size for better visibility
          // Using more contrasting colors with higher opacity
          color: `rgba(220, 220, 230, ${opacity})`,
          speed: 0.2 + Math.random() * 0.3,
          opacity,
          parallaxFactor,
          directionX: Math.random() > 0.5 ? 1 : -1,
          directionY: Math.random() > 0.5 ? 1 : -1,
          driftRadius,
          driftAngle,
          driftSpeed
        });
      }
    };
    
    // Animate particles
    const animate = () => {
      // Use a semi-transparent clear to create subtle trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get the current time for animation
      const time = Date.now() * 0.0002;
      const scrollY = scrollYRef.current;
      
      // Update and draw particles
      particles.forEach(particle => {
        // Apply parallax effect based on scroll position
        const parallaxOffset = scrollY * particle.parallaxFactor;
        
        // Calculate drift position
        const driftX = Math.cos(particle.driftAngle) * particle.driftRadius;
        const driftY = Math.sin(particle.driftAngle) * particle.driftRadius;
        
        // Update drift angle
        particle.driftAngle += particle.driftSpeed;
        
        // Calculate final position with parallax and drift
        const x = particle.originalX + driftX;
        const y = particle.originalY + driftY - parallaxOffset;
        
        // Only draw if within canvas bounds with a small margin
        if (x >= -20 && x <= canvas.width + 20 && y >= -20 && y <= canvas.height + 20) {
          // Add subtle pulsing to the opacity
          const dynamicOpacity = particle.opacity * (0.8 + Math.sin(time * 5 + particle.driftAngle * 2) * 0.2);
          
          ctx.beginPath();
          ctx.arc(x, y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(250, 250, 250, ${dynamicOpacity})`;
          ctx.fill();
        }
      });
      
      // Add a subtle glow effect to enhance visibility
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.4, Math.max(canvas.width, canvas.height) * 0.8
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.globalCompositeOperation = 'screen'; // Changed to screen for better blending
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
        zIndex: -1, // Changed from -10 to -1 to ensure visibility
        pointerEvents: 'none',
        background: 'rgba(0, 0, 0, 0.97)', // Adding a dark background for contrast
      }}
    />
  );
};

export default BackgroundEffect;
