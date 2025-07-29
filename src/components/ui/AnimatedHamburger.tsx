import React from 'react';

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({ isOpen, onClick }) => {
  return (
    <label className="smooth-hamburger md:hidden" htmlFor="menu-toggle">
      <input 
        id="menu-toggle" 
        type="checkbox" 
        checked={isOpen}
        onChange={onClick}
        aria-label="Toggle menu"
      />
      <div className="menu">
        <div className="menu_part"></div>
        <div className="menu_part"></div>
        <div className="menu_part"></div>
      </div>
    </label>
  );
};

export default AnimatedHamburger;