
import React, { useEffect, useRef } from 'react';

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  
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
        y: e.clientY
      };
    };
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`Canvas resized: ${canvas.width}x${canvas.height}`);
      
      // Initialize particles after resize
      initializeParticles();
    };
    
    // Particles array
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 50; // Keep the count low for minimalism
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      opacity: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 2 + 1; // Small dots
        this.density = (Math.random() * 10) + 1;
        this.opacity = Math.random() * 0.5 + 0.2; // Subtle opacity
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 120, 130, ${this.opacity})`;
        ctx.fill();
      }
      
      update() {
        // Calculate distance between particle and mouse
        const dx = mousePositionRef.current.x - this.x;
        const dy = mousePositionRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        
        // Move particles away from mouse within a certain radius
        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * -0.5;
          const directionY = forceDirectionY * force * this.density * -0.5;
          
          this.x += directionX;
          this.y += directionY;
        } else {
          // Slowly return to original position
          if (this.x !== this.baseX) {
            const dx = this.baseX - this.x;
            this.x += dx / 20;
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
      particles.length = 0; // Clear existing particles
      
      // Create particles distributed across the screen
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
      
      console.log(`Animation started with ${PARTICLE_COUNT} particles`);
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
