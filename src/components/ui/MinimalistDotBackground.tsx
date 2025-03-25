
import React, { useEffect, useRef } from 'react';

const MinimalistDotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  
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
    const PARTICLE_COUNT = 350; // Keeping 350 dots
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      speed: number;
      angle: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 2.2 + 1.2; // Larger size
        this.density = (Math.random() * 8) + 1;
        this.speed = Math.random() * 0.08 + 0.02; // Very slow speed
        this.angle = Math.random() * Math.PI * 2; // Random initial angle
      }
      
      draw() {
        if (!ctx) return;
        
        // Create a radial gradient for each dot to make them smooth at edges
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        
        gradient.addColorStop(0, 'rgba(30, 30, 35, 0.7)'); // Solid in the center
        gradient.addColorStop(0.6, 'rgba(30, 30, 35, 0.4)'); // Start fading
        gradient.addColorStop(1, 'rgba(30, 30, 35, 0)'); // Completely transparent at edge
        
        // Enhanced smoothing with better shadow effect
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
      }
      
      update(time: number) {
        // Calculate distance between particle and mouse
        const dx = mousePositionRef.current.x - this.x;
        const dy = mousePositionRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100; // Keep interaction radius
        
        // Move particles away from mouse slightly
        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * -0.9;
          const directionY = forceDirectionY * force * this.density * -0.9;
          
          this.x += directionX;
          this.y += directionY;
        } else {
          // Passive slow movement in a figure-8 pattern
          const xMovement = Math.sin(time * this.speed + this.angle) * 1.5;
          const yMovement = Math.sin(time * this.speed * 0.8 + this.angle) * Math.cos(time * this.speed * 0.4 + this.angle) * 1.5;
          
          // Blend passive movement with return to base position
          if (this.x !== this.baseX) {
            const dx = this.baseX - this.x;
            this.x += dx / 15 + xMovement * 0.05;
          } else {
            this.x += xMovement * 0.05;
          }
          
          if (this.y !== this.baseY) {
            const dy = this.baseY - this.y;
            this.y += dy / 15 + yMovement * 0.05;
          } else {
            this.y += yMovement * 0.05;
          }
        }
        
        this.draw();
      }
    }
    
    // Initialize particles with more random distribution
    const initializeParticles = () => {
      particles.length = 0;
      
      // Completely random distribution
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };
    
    // Animation loop
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;
      
      // Update time value for passive movement
      timeRef.current = timestamp * 0.001; // Convert to seconds for easier math
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => particle.update(timeRef.current));
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate(0);
    
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
