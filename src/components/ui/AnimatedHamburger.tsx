import React from 'react';

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      className="animated-hamburger md:hidden text-foreground p-2 rounded-md" 
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Toggle menu"
      aria-pressed={isOpen}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        className="hamburger-svg"
      >
        <rect x="3" y="6" width="18" height="2" rx="1" className="hamburger-line top" />
        <rect x="3" y="11" width="18" height="2" rx="1" className="hamburger-line middle" />
        <rect x="3" y="16" width="18" height="2" rx="1" className="hamburger-line bottom" />
      </svg>
    </button>
  );
};

export default AnimatedHamburger;