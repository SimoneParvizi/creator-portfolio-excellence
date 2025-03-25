
import React, { useEffect, useState, useRef } from 'react';

const MouseScrollIndicator: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [hoveringHeading, setHoveringHeading] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update target position for smoother following
      setTargetPosition({
        x: e.clientX,
        y: e.clientY
      });
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
    setTargetPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    // Animation frame for smooth movement
    let animationFrameId: number;
    
    const animatePosition = () => {
      // Add easing effect for smoother, delayed movement
      setPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.05, // Reduced easing factor for more sliding effect
        y: prev.y + (targetPosition.y - prev.y) * 0.05
      }));
      
      animationFrameId = requestAnimationFrame(animatePosition);
    };
    
    animatePosition();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseover', handleNavHover);
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetPosition]);
  
  if (!visible || hovering) return null;
  
  return (
    <div 
      ref={cursorRef}
      className="fixed pointer-events-none z-50 flex items-center justify-center"
      style={{
        left: `${position.x + 28}px`, // Position to the right of the cursor
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
      }}
    >
      <div className={`font-sans text-xs font-medium tracking-wider ${hoveringHeading ? 'text-white' : 'text-black'} opacity-80`}>
        scroll down
      </div>
    </div>
  );
};

export default MouseScrollIndicator;
