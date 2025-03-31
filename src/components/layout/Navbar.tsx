
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  // Helper function to determine if a link should go to a section on the homepage
  const getLinkProps = (path: string) => {
    if (location.pathname === '/' && path.startsWith('#')) {
      return { href: path };
    } else if (path.startsWith('#') && location.pathname !== '/') {
      return { to: `/${path}`, as: Link };
    } else {
      return { to: path, as: Link };
    }
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
            <Link to="/" className="text-xl font-display tracking-tight">
              <span className="font-bold">Simone</span> Parvizi
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/about" className="nav-link fancy-hover">About</Link>
            {location.pathname === '/' ? (
              <a href="#projects" className="nav-link fancy-hover">Projects</a>
            ) : (
              <Link to="/#projects" className="nav-link fancy-hover">Projects</Link>
            )}
            {location.pathname === '/' ? (
              <a href="#books" className="nav-link fancy-hover">Book</a>
            ) : (
              <Link to="/#books" className="nav-link fancy-hover">Book</Link>
            )}
            <Link to="/booking" className="nav-link fancy-hover">Book My Time</Link>
            {location.pathname === '/' ? (
              <a href="#contact" className="nav-link fancy-hover">Contact</a>
            ) : (
              <Link to="/#contact" className="nav-link fancy-hover">Contact</Link>
            )}
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
          <Link 
            to="/about" 
            className="block text-lg font-medium py-2 nav-link fancy-hover" 
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          {location.pathname === '/' ? (
            <a 
              href="#projects" 
              className="block text-lg font-medium py-2 nav-link fancy-hover" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </a>
          ) : (
            <Link
              to="/#projects" 
              className="block text-lg font-medium py-2 nav-link fancy-hover" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
          )}
          {location.pathname === '/' ? (
            <a 
              href="#books" 
              className="block text-lg font-medium py-2 nav-link fancy-hover" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Book
            </a>
          ) : (
            <Link 
              to="/#books" 
              className="block text-lg font-medium py-2 nav-link fancy-hover" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Book
            </Link>
          )}
          <Link
            to="/booking" 
            className="block text-lg font-medium py-2 nav-link fancy-hover" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Book My Time
          </Link>
          {location.pathname === '/' ? (
            <a 
              href="#contact" 
              className="block text-lg font-medium py-2 nav-link fancy-hover" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          ) : (
            <Link 
              to="/#contact" 
              className="block text-lg font-medium py-2 nav-link fancy-hover" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
