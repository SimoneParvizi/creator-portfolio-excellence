
import React, { useEffect, useState } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = "", 
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {text}
      </div>
    </div>
  );
};

export default AnimatedText;
