import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Books from '@/components/sections/Books';
import P5aBackground from '@/components/ui/P5aBackground';

const Book = () => {
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
    <div className="min-h-screen relative overflow-x-hidden bg-background">
      <P5aBackground />
      <Navbar />
      <main className="pt-20">
        <Books />
      </main>
    </div>
  );
};

export default Book;