
import React, { useEffect, useState, useRef } from 'react';

const MouseScrollIndicator: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Update position immediately for more responsive movement
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }
    };
    
    const handleScroll = () => {
      // Hide indicator on scroll
      if (window.scrollY > 10) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Set initial position
    setPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  if (!visible) return null;
  
  return (
    <div 
      ref={cursorRef}
      className="fixed pointer-events-none z-50 flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        // Remove transition for immediate response to mouse movements
      }}
    >
      <div className="bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs uppercase tracking-wider">
        scroll
      </div>
    </div>
  );
};

export default MouseScrollIndicator;
