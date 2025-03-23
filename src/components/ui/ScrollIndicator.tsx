
import React from 'react';
import { ChevronDown } from 'lucide-react';

const ScrollIndicator: React.FC = () => {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer animate-bounce-subtle" onClick={scrollToNextSection}>
      <div className="text-sm font-medium tracking-wide mb-2 opacity-80">Scroll</div>
      <ChevronDown size={20} className="opacity-80" />
    </div>
  );
};

export default ScrollIndicator;
