
import React, { useEffect, useState, useRef } from 'react';

const MouseScrollIndicator: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [hoveringHeading, setHoveringHeading] = useState(false);
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

    const handleNavHover = (e: MouseEvent) => {
      // Check if hovering over nav links
      const target = e.target as Element;
      const isNavLink = target.closest('.nav-link') !== null;
      setHovering(isNavLink);
      
      // Check if hovering over main heading
      const isHeading = target.closest('h1') !== null;
      setHoveringHeading(isHeading);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mouseover', handleNavHover);
    
    // Set initial position
    setPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseover', handleNavHover);
    };
  }, []);
  
  if (!visible || hovering) return null;
  
  return (
    <div 
      ref={cursorRef}
      className="fixed pointer-events-none z-50 flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 25}px`, // Position slightly above the cursor
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className={`font-display text-xs tracking-widest ${hoveringHeading ? 'text-white' : 'text-black'} italic font-light opacity-80`}>
        scroll me
      </div>
    </div>
  );
};

export default MouseScrollIndicator;
