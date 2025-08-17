
import React, { useState, useEffect } from 'react';
import { Linkedin, Mail } from 'lucide-react';
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

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle body scroll when menu state changes
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scroll when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
            <button 
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center"
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
            <AnimatedText delay={100} className="inline-block">
              <Link to="/book" className="nav-link fancy-hover font-lora">
                Book
              </Link>
            </AnimatedText>
            <AnimatedText delay={200} className="inline-block">
              <button onClick={() => handleSectionClick('projects')} className="nav-link fancy-hover font-lora">
                Projects
              </button>
            </AnimatedText>
            <AnimatedText delay={400} className="inline-block">
              <button onClick={handleContactClick} className="nav-link fancy-hover font-lora">
                Contact
              </button>
            </AnimatedText>
            <AnimatedText delay={500} className="inline-block">
              <Link 
                to="/about" 
                className="nav-link fancy-hover font-lora"
                onClick={() => {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                About me
              </Link>
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
        className={`md:hidden fixed left-0 right-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100' 
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: scrolled ? '64px' : '96px' }}
      >
        <div className="flex flex-col" style={{ height: '100vh' }}>
          <div className="px-4 pt-6 pb-8 bg-white">
            <div className="flex flex-wrap gap-6 justify-center">
              <Link
                to="/book" 
                className="text-lg font-medium py-2 nav-link fancy-hover font-lora"
                onClick={() => {
                setMobileMenuOpen(false);
                document.body.style.overflow = 'unset';
              }}
              >
                Book
              </Link>
              <button
                onClick={() => {
                  handleSectionClick('projects');
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium py-2 nav-link fancy-hover font-lora"
              >
                Projects
              </button>
              <button
                onClick={() => {
                  handleContactClick();
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium py-2 nav-link fancy-hover font-lora"
              >
                Contact
              </button>
              <Link 
                to="/about" 
                className="text-lg font-medium py-2 nav-link fancy-hover font-lora" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                About me
              </Link>
            </div>
          </div>
          
          {/* Social Media Icons - Mobile Only */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 pt-1 bg-white">
              <div className="pt-1">
                <div className="flex space-x-6 justify-center">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      document.body.style.overflow = 'unset';
                    }}
                  >
                    <Linkedin size={24} />
                  </a>
                  <a 
                    href="mailto:contact@example.com" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      document.body.style.overflow = 'unset';
                    }}
                  >
                    <Mail size={24} />
                  </a>
                </div>
              </div>
            </div>
            {/* Semi-transparent area below social icons */}
            <div className="flex-1 bg-white/80"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
