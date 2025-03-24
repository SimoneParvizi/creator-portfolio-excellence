
import React, { useEffect, useRef } from 'react';

const MinimalistDotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
    };
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    // Particles array
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 40; // Small number for minimalism
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 2; // Small dot size for minimalism
        this.density = (Math.random() * 5) + 1;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#c0c0c6'; // Subtle light gray color
        ctx.fill();
      }
      
      update() {
        // Calculate distance between particle and mouse
        const dx = mousePositionRef.current.x - this.x;
        const dy = mousePositionRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 80; // Small interaction radius
        
        // Move particles away from mouse slightly
        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * -0.8; // Subtle movement
          const directionY = forceDirectionY * force * this.density * -0.8;
          
          this.x += directionX;
          this.y += directionY;
        } else {
          // Return to original position very slowly
          if (this.x !== this.baseX) {
            const dx = this.baseX - this.x;
            this.x += dx / 20; // Very slow return for subtle effect
          }
          if (this.y !== this.baseY) {
            const dy = this.baseY - this.y;
            this.y += dy / 20;
          }
        }
        
        this.draw();
      }
    }
    
    // Initialize particles
    const initializeParticles = () => {
      particles.length = 0;
      
      // Space particles evenly in a grid
      const gridSize = Math.sqrt(PARTICLE_COUNT);
      const spacingX = canvas.width / (gridSize + 1);
      const spacingY = canvas.height / (gridSize + 1);
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          // Add a bit of random offset
          const offsetX = (Math.random() - 0.5) * 30;
          const offsetY = (Math.random() - 0.5) * 30;
          
          const x = (i + 1) * spacingX + offsetX;
          const y = (j + 1) * spacingY + offsetY;
          
          if (particles.length < PARTICLE_COUNT) {
            particles.push(new Particle(x, y));
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => particle.update());
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();
    
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default MinimalistDotBackground;
