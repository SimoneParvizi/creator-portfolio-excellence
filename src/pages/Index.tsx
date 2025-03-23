
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Books from '../components/sections/Books';
import Booking from '../components/sections/Booking';
import Contact from '../components/sections/Contact';
import BackgroundEffect from '../components/ui/BackgroundEffect';

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

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <BackgroundEffect />
      <Navbar />
      <main>
        <Hero />
        <Books />
        <Projects />
        <Booking />
        <About />
        <Contact />
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm relative z-10">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} John Doe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
