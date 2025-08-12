
import React, { useRef, useEffect } from 'react';
import Gallery3D from '../ui/Gallery3D';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative z-10 flex items-center justify-center min-h-screen pt-20 md:pt-0 md:h-screen">
      <div className="w-full px-4 md:px-0">
        {/* 3D Photo Gallery */}
        <Gallery3D />
      </div>
    </section>
  );
};

export default About;
