
import React, { useEffect, useRef, useState } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = "", 
  once = true,
  delay = 0
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    
    if (textRef.current) {
      observer.observe(textRef.current);
    }
    
    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, [once, delay]);
  
  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        ref={textRef} 
        className={`transform transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {text}
      </div>
    </div>
  );
};

export default AnimatedText;
