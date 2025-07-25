
import React, { useEffect, useRef } from 'react';

const MinimalistDotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastResizeRef = useRef({ width: 0, height: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size with throttling to prevent mobile scroll issues
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Only resize if there's a significant change to prevent mobile scroll glitches
      const widthDiff = Math.abs(newWidth - lastResizeRef.current.width);
      const heightDiff = Math.abs(newHeight - lastResizeRef.current.height);
      
      // Throttle resize to prevent particles jumping during mobile scrolling
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        // Only reinitialize particles if there's a significant size change (not just mobile scroll)
        if (widthDiff > 50 || heightDiff > 100) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          lastResizeRef.current = { width: newWidth, height: newHeight };
          initializeParticles();
        } else {
          // Just update canvas size without recreating particles
          canvas.width = newWidth;
          canvas.height = newHeight;
        }
      }, 150); // Debounce resize events
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
    const PARTICLE_COUNT = 450; // Increased from 350 to 450 dots
    
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
        this.size = Math.random() * 3 + 1.5; // Even larger size for more gradual fade
        this.density = (Math.random() * 8) + 1;
        this.speed = Math.random() * 0.08 + 0.02; // Very slow speed
        this.angle = Math.random() * Math.PI * 2; // Random initial angle
      }
      
      draw() {
        if (!ctx) return;
        
        // Create a radial gradient with a larger radius for more gradual fade
        const radius = this.size * 3; // Increase the radius for a more gradual fade
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, radius
        );
        
        // Less transparent colors
        gradient.addColorStop(0, 'rgba(140, 140, 155, 0.7)'); // Higher opacity center
        gradient.addColorStop(0.3, 'rgba(140, 140, 155, 0.5)'); // Higher opacity middle fade
        gradient.addColorStop(0.7, 'rgba(140, 140, 155, 0.3)'); // Higher opacity further fade
        gradient.addColorStop(1, 'rgba(140, 140, 155, 0)'); // Completely transparent at edge
        
        // Enhanced smoothing with even better shadow effect
        ctx.shadowBlur = 8; // Increased blur for even smoother edges
        ctx.shadowColor = 'rgba(255, 255, 255, 0.1)'; // Lighter shadow
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
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
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
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
