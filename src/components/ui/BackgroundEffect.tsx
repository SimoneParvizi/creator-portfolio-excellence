
import React, { useEffect, useRef } from 'react';

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);

  interface Node {
    x: number;
    y: number;
    size: number;
    speed: number;
    vx: number;
    vy: number;
    color: string;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY
      };
    };

    // Track scroll position
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    // Create a grid of nodes
    const initNodes = () => {
      const nodes: Node[] = [];
      const gridSize = Math.max(canvas.width, canvas.height) > 1000 ? 20 : 15;
      const spacing = Math.min(canvas.width, canvas.height) / gridSize;
      
      // Create a grid across the entire viewport and beyond for scrolling
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height * 3; y += spacing) { // Extended for scrolling
          if (Math.random() > 0.4) { // 60% chance to create a node for a sparser look
            nodes.push({
              x: x + (Math.random() * spacing * 0.4),
              y: y + (Math.random() * spacing * 0.4),
              size: Math.random() * 2 + 1,
              speed: Math.random() * 0.8 + 0.2,
              vx: 0,
              vy: 0,
              color: getNodeColor(0.7 + Math.random() * 0.3)
            });
          }
        }
      }
      
      nodesRef.current = nodes;
    };

    // Generate futuristic colors
    const getNodeColor = (opacity: number) => {
      const colors = [
        `rgba(0, 255, 255, ${opacity})`,     // Cyan
        `rgba(114, 225, 255, ${opacity})`,   // Electric Blue
        `rgba(0, 229, 255, ${opacity})`,     // Bright Teal
        `rgba(72, 191, 227, ${opacity})`,    // Deep Sky Blue
        `rgba(0, 143, 230, ${opacity})`,     // Sapphire
        `rgba(10, 186, 181, ${opacity})`,    // Turquoise
        `rgba(0, 201, 182, ${opacity})`,     // Teal Green
        `rgba(0, 214, 203, ${opacity})`,     // Aquamarine
        `rgba(105, 240, 174, ${opacity})`,   // Mint
        `rgba(32, 191, 107, ${opacity})`,    // Emerald
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Main rendering function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create minimal dark background with a subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f0f12');
      gradient.addColorStop(1, '#121218');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Adjust for scrolling
      ctx.save();
      ctx.translate(0, -scrollYRef.current);
      
      // Update nodes with mouse influence
      nodesRef.current.forEach(node => {
        // Calculate distance from mouse
        const dx = node.x - mouseRef.current.x;
        const dy = node.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Mouse repulsion effect - stronger and with wider range
        if (distance < 250) {
          const force = (250 - distance) / 10;
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle) * force * 0.08;
          node.vy += Math.sin(angle) * force * 0.08;
        }
        
        // Apply velocity with damping
        node.vx *= 0.95;
        node.vy *= 0.95;
        node.x += node.vx;
        node.y += node.vy;
        
        // Slight random movement
        node.x += (Math.random() - 0.5) * 0.3;
        node.y += (Math.random() - 0.5) * 0.3;
        
        // Draw the node as a small circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });
      
      // Draw connections for geometric patterns
      nodesRef.current.forEach((node, i) => {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const otherNode = nodesRef.current[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Draw connection if within threshold
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            const opacity = (100 - distance) / 100;
            ctx.strokeStyle = `rgba(0, 210, 255, ${opacity * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      // Draw mouse influence area - subtle glow effect
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      // Only draw if mouse has moved inside canvas
      if (mouseX > 0 && mouseY > 0) {
        const radius = 120;
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, radius
        );
        gradient.addColorStop(0, 'rgba(0, 210, 255, 0.08)');
        gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      ctx.restore();
      
      rafRef.current = requestAnimationFrame(draw);
    };
    
    // Initialize and start animation
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    draw();
    
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
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BackgroundEffect;
