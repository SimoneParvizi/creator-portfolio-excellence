
import React, { useEffect, useState } from 'react';

const MouseScrollIndicator: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Set initial positions
    setPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    setTargetPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    const handleMouseMove = (e: MouseEvent) => {
      // Update target position when mouse moves
      setTargetPosition({
        x: e.clientX,
        y: e.clientY
      });
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
    let animationFrameId: number;
    
    const animatePosition = () => {
      // Delayed following with easing factor
      setPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.1,
        y: prev.y + (targetPosition.y - prev.y) * 0.1
      }));
      
      animationFrameId = requestAnimationFrame(animatePosition);
    };
    
    animatePosition();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  if (!visible) return null;
  
  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x + 30}px`, // Position to the right of cursor
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
      }}
    >
      <div className="font-sans text-xs font-medium tracking-wider text-black opacity-80">
        scroll down
      </div>
    </div>
  );
};

export default MouseScrollIndicator;
