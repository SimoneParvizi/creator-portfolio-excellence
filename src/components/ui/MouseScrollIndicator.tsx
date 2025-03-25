
import React, { useEffect, useState } from 'react';

const MouseScrollIndicator: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Set initial position
    setPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    const handleMouseMove = (e: MouseEvent) => {
      // Directly update position with current mouse position plus offset
      setPosition({
        x: e.clientX + 30, // Position to the right of cursor
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
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  if (!visible) return null;
  
  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
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
