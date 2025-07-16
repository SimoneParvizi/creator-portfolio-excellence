
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
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
      <Navbar />
      <Hero />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-foreground">Hello World + Navbar + Hero</h1>
        <p className="text-muted-foreground">If you can see this, Hero is working too.</p>
      </div>
    </div>
  );
};

export default Index;
