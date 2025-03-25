
import React, { useEffect, useState, useRef } from 'react';

const MouseScrollIndicator: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [visible, setVisible] = useState(false); // Start invisible
  const animationFrameRef = useRef<number>();
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Track mouse position without causing re-renders
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = {
        x: e.clientX + 30, // Position to the right of cursor
        y: e.clientY
      };
      
      // Make visible after first mouse move
      if (!visible) {
        setVisible(true);
      }
    };
    
    const handleScroll = () => {
      // Hide indicator when scrolling
      if (window.scrollY > 10) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Animation loop for smooth following
    const animatePosition = () => {
      setPosition(prev => ({
        x: prev.x + (mousePositionRef.current.x - prev.x) * 0.02, // Even slower for more lag
        y: prev.y + (mousePositionRef.current.y - prev.y) * 0.02
      }));
      
      animationFrameRef.current = requestAnimationFrame(animatePosition);
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animatePosition);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
        transition: 'opacity 0.3s ease'
      }}
    >
      <div className="font-sans text-xs font-medium tracking-wider text-black opacity-80">
        scroll down
      </div>
    </div>
  );
};

export default MouseScrollIndicator;
