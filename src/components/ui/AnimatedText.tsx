
import React, { useEffect, useRef } from 'react';

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
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('reveal');
            }, delay);
            
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('reveal');
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
        className="mask-reveal"
      >
        {text}
      </div>
    </div>
  );
};

export default AnimatedText;
