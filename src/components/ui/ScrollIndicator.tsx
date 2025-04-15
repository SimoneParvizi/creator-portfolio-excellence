
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ScrollIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const exitTimeoutRef = useRef<NodeJS.Timeout>();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        
        if (heroBottom <= 0 && isVisible && !isExiting) {
          // Start exit animation
          setIsExiting(true);
          
          // Actually hide after animation completes
          if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
          exitTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
          }, 800); // Match animation duration
        }
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, [isVisible, isExiting]);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isMobile) return null;
  if (!isVisible) return null;

  return (
    <div 
      className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer ${isExiting ? 'animate-wobble-fade-out' : 'animate-bounce-subtle'}`} 
      onClick={scrollToNextSection}
    >
      <div className="text-sm font-medium tracking-wide mb-2 opacity-80">Scroll</div>
      <ChevronDown size={20} className="opacity-80" />
    </div>
  );
};

export default ScrollIndicator;
