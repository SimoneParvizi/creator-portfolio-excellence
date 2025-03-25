
import React, { useEffect, useState, useRef } from 'react';

const MouseScrollIndicator: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const animationFrameRef = useRef<number>();
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    // Force immediate positioning on first render to avoid top-left flash
    if (!isInitializedRef.current) {
      const initialX = window.innerWidth / 2;
      const initialY = window.innerHeight / 2;
      
      setPosition({
        x: initialX,
        y: initialY
      });
      setTargetPosition({
        x: initialX,
        y: initialY
      });
      
      isInitializedRef.current = true;
      
      // Set position immediately based on cursor if available
      const setInitialPosition = () => {
        document.addEventListener('mousemove', onFirstMove, { once: true });
      };
      
      const onFirstMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX + 30,
          y: e.clientY
        });
        setTargetPosition({
          x: e.clientX + 30,
          y: e.clientY
        });
      };
      
      setInitialPosition();
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      // Update target position when mouse moves
      setTargetPosition({
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
    
    // Animation loop for smooth following with even more delay
    const animatePosition = () => {
      // Use an even smaller easing factor (0.03 instead of 0.05) for more delay and smoother sliding
      setPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.03,
        y: prev.y + (targetPosition.y - prev.y) * 0.03
      }));
      
      animationFrameRef.current = requestAnimationFrame(animatePosition);
    };
    
    animatePosition();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
