
import React, { useState, useEffect } from 'react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AnimatedText from '@/components/ui/AnimatedText';
import AnimatedHamburger from '@/components/ui/AnimatedHamburger';

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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center -ml-2"
            >
              <img 
                src="/lovable-uploads/8c9a2e3b-8f7a-4bbe-abd3-fd1d086dcc51.png" 
                alt="SP Logo" 
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* Desktop Navigation - Updated Order */}
          <nav className="hidden md:flex space-x-3">
            <AnimatedText delay={200} className="inline-block">
              <button onClick={() => handleSectionClick('books')} className="nav-link fancy-hover font-lora">
                Book
              </button>
            </AnimatedText>
            <AnimatedText delay={400} className="inline-block">
              <button onClick={() => handleSectionClick('projects')} className="nav-link fancy-hover font-lora">
                Projects
              </button>
            </AnimatedText>
            <AnimatedText delay={600} className="inline-block">
              <Link to="/booking" className="nav-link fancy-hover font-lora">Start the Conversation</Link>
            </AnimatedText>
            <AnimatedText delay={800} className="inline-block">
              <button onClick={handleContactClick} className="nav-link fancy-hover font-lora">
                Contact
              </button>
            </AnimatedText>
            <AnimatedText delay={1000} className="inline-block">
              <Link to="/about" className="nav-link fancy-hover font-lora">About</Link>
            </AnimatedText>
          </nav>

          {/* Mobile Menu Button */}
          <AnimatedHamburger 
            isOpen={mobileMenuOpen}
            onClick={toggleMobileMenu}
          />
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
        <div className="px-4 pt-6 pb-8 space-y-3 bg-background/95 backdrop-blur-md h-full">
          <button
            onClick={() => {
              handleSectionClick('books');
              setMobileMenuOpen(false);
            }}
            className="block text-lg font-medium py-2 nav-link fancy-hover text-left font-lora"
          >
            Book
          </button>
          <button
            onClick={() => {
              handleSectionClick('projects');
              setMobileMenuOpen(false);
            }}
            className="block text-lg font-medium py-2 nav-link fancy-hover text-left font-lora"
          >
            Projects
          </button>
          <Link
            to="/booking" 
            className="block text-lg font-medium py-2 nav-link fancy-hover font-lora" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Start the Conversation
          </Link>
          <button
            onClick={() => {
              handleContactClick();
              setMobileMenuOpen(false);
            }}
            className="block text-lg font-medium py-2 nav-link fancy-hover text-left font-lora"
          >
            Contact
          </button>
          <Link 
            to="/about" 
            className="block text-lg font-medium py-2 nav-link fancy-hover font-lora" 
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          
          {/* Social Media Icons - Mobile Only */}
          <div className="pt-6 mt-4 border-t border-border/40">
            <div className="flex space-x-6 justify-center">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img src="/lovable-uploads/9dfef179-60d5-4651-9754-2372045ac5c8.png" alt="X" className="w-6 h-6" />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
