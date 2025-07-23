
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSimple from '../components/sections/HeroSimple';
import Hero from '../components/sections/Hero';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Books from '../components/sections/Books';
import Contact from '../components/sections/Contact';
import P5aBackground from '../components/ui/P5aBackground';
import FixedSocialSidebar from '../components/ui/FixedSocialSidebar';

const Index = () => {
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const elements = document.querySelectorAll('.slide-up');

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  console.log('Index component rendering...');

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background">
      <P5aBackground />
      <div className="navbar-animate">
        <Navbar />
      </div>
      <div className="page-load-animation">
        <FixedSocialSidebar />
      </div>
      <main>
        <div className="hero-animate">
          <HeroSimple />
        </div>
        <div className="page-load-animation page-load-delayed">
          <Skills />
        </div>
        <div className="page-load-animation page-load-delayed-2">
          <Books />
        </div>
        <div className="page-load-animation page-load-delayed-3">
          <Projects />
        </div>
        <div className="page-load-animation page-load-delayed-4">
          <Contact />
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm relative z-40 bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] page-load-animation page-load-delayed-4">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Simone Parvizi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
