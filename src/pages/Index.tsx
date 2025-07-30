
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSimple from '../components/sections/HeroSimple';
import Hero from '../components/sections/Hero';
import ArtOfReduction from '../components/sections/ArtOfReduction';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
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
      <Navbar />
      <FixedSocialSidebar />
      <main>
        <HeroSimple />
        <Skills />
        <Projects />
        <ArtOfReduction />
        <Contact />
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm relative z-40 bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Simone Parvizi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
