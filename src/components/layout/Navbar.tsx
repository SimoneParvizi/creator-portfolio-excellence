
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleContactClick = () => {
    if (location.pathname === '/') {
      // If already on homepage, just scroll to contact
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to homepage then scroll to contact
      navigate('/', { replace: true });
      setTimeout(() => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on homepage, just scroll to section
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to homepage then scroll to section
      navigate('/', { replace: true });
      setTimeout(() => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/8c9a2e3b-8f7a-4bbe-abd3-fd1d086dcc51.png" 
                alt="SP Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Updated Order */}
          <nav className="hidden md:flex space-x-3">
            <button onClick={() => handleSectionClick('books')} className="nav-link fancy-hover">
              Book
            </button>
            <button onClick={() => handleSectionClick('projects')} className="nav-link fancy-hover">
              Projects
            </button>
            <Link to="/booking" className="nav-link fancy-hover">Start the Conversation</Link>
            <button onClick={handleContactClick} className="nav-link fancy-hover">
              Contact
            </button>
            <Link to="/about" className="nav-link fancy-hover">About</Link>
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

      {/* Mobile Navigation - Updated Order */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100 h-screen' 
            : 'opacity-0 h-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-6 pb-8 space-y-3 bg-background/90 backdrop-blur-md">
          <button
            onClick={() => {
              handleSectionClick('books');
              setMobileMenuOpen(false);
            }}
            className="block text-lg font-medium py-2 nav-link fancy-hover text-left"
          >
            Book
          </button>
          <button
            onClick={() => {
              handleSectionClick('projects');
              setMobileMenuOpen(false);
            }}
            className="block text-lg font-medium py-2 nav-link fancy-hover text-left"
          >
            Projects
          </button>
          <Link
            to="/booking" 
            className="block text-lg font-medium py-2 nav-link fancy-hover" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Start the Conversation
          </Link>
          <button
            onClick={() => {
              handleContactClick();
              setMobileMenuOpen(false);
            }}
            className="block text-lg font-medium py-2 nav-link fancy-hover text-left"
          >
            Contact
          </button>
          <Link 
            to="/about" 
            className="block text-lg font-medium py-2 nav-link fancy-hover" 
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
