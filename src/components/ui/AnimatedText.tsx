
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
              if (textRef.current) {
                textRef.current.classList.add('reveal');
              }
            }, delay);
            
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            if (textRef.current) {
              textRef.current.classList.remove('reveal');
            }
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
    <div className={`overflow-hidden ${className}`} style={{ display: 'block', visibility: 'visible' }}>
      <div 
        ref={textRef} 
        className="mask-reveal"
        style={{ 
          opacity: 1, 
          transform: 'translateY(0)',
          visibility: 'visible',
          display: 'block'
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default AnimatedText;
