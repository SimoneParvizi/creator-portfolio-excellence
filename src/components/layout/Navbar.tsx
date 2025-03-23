
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md py-3 shadow-sm' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="text-xl font-display tracking-tight">
              <span className="font-bold">John</span> Doe
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="nav-link">About</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#books" className="nav-link">Book</a>
            <a href="#booking" className="nav-link">Book My Time</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground p-2 rounded-md" 
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100 h-screen' 
            : 'opacity-0 h-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-6 pb-8 space-y-6 bg-background/90 backdrop-blur-md">
          <a 
            href="#about" 
            className="block text-lg font-medium py-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a 
            href="#projects" 
            className="block text-lg font-medium py-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects
          </a>
          <a 
            href="#books" 
            className="block text-lg font-medium py-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Book
          </a>
          <a 
            href="#booking" 
            className="block text-lg font-medium py-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Book My Time
          </a>
          <a 
            href="#contact" 
            className="block text-lg font-medium py-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
