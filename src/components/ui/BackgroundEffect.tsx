
import React, { useEffect, useRef } from 'react';

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  
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
    
    // Initialize particles
    const particleCount = 2500;
    const particles: Particle[] = [];
    
    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      opacity: number;
      angle: number;
      distance: number;
      centerX: number;
      centerY: number;
    }
    
    // Create semicircle of particles
    const createParticles = () => {
      particles.length = 0;
      const centerX = canvas.width * 0.7;
      const centerY = canvas.height * 0.35;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.4;
      
      for (let i = 0; i < particleCount; i++) {
        // Create particles around a semicircle (0 to PI)
        const angle = Math.random() * Math.PI;
        // Create a distance distribution that favors the edge
        const distanceRatio = Math.pow(Math.random(), 0.4);
        const distance = maxRadius * distanceRatio;
        
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: Math.random() * 1.8 + 0.4,
          color: `rgba(220, 220, 230, ${Math.random() * 0.3 + 0.5})`,
          speed: 0.1 + Math.random() * 0.2,
          opacity: Math.random() * 0.4 + 0.6,
          angle,
          distance,
          centerX,
          centerY
        });
      }
    };
    
    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.35, 0,
        canvas.width * 0.7, canvas.height * 0.35, Math.max(canvas.width, canvas.height) * 0.6
      );
      gradient.addColorStop(0, 'rgba(240, 240, 245, 0.01)');
      gradient.addColorStop(0.6, 'rgba(235, 235, 245, 0.005)');
      gradient.addColorStop(1, 'rgba(245, 245, 250, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      const time = Date.now() * 0.0002;
      
      particles.forEach(particle => {
        // Add slight movement to particles
        const xOffset = Math.sin(time + particle.angle * 10) * 2;
        const yOffset = Math.cos(time + particle.angle * 5) * 2;
        
        const x = particle.centerX + Math.cos(particle.angle) * particle.distance + xOffset;
        const y = particle.centerY + Math.sin(particle.angle) * particle.distance + yOffset;
        
        // Only draw if within canvas bounds
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          // Oscillate opacity for twinkling effect
          const dynamicOpacity = particle.opacity * (0.7 + Math.sin(time * 5 + particle.angle * 2) * 0.3);
          
          ctx.beginPath();
          ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230, 230, 240, ${dynamicOpacity})`;
          ctx.fill();
        }
      });
      
      // Add a subtle glow around the edge
      const edgeGradient = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.35, Math.max(canvas.width, canvas.height) * 0.35,
        canvas.width * 0.7, canvas.height * 0.35, Math.max(canvas.width, canvas.height) * 0.45
      );
      edgeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      edgeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = edgeGradient;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.7, canvas.height * 0.35, Math.max(canvas.width, canvas.height) * 0.4, 0, Math.PI, true);
      ctx.arc(canvas.width * 0.7, canvas.height * 0.35, Math.max(canvas.width, canvas.height) * 0.3, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      
      ctx.globalCompositeOperation = 'source-over';
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    setCanvasDimensions();
    createParticles();
    animate();
    console.log('Animation started with', particles.length, 'particles');
    
    // Handle window resize
    window.addEventListener('resize', () => {
      setCanvasDimensions();
      createParticles();
    });
    
    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', setCanvasDimensions);
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
        zIndex: -10,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundEffect;
