import React, { useRef, useEffect } from 'react';

const ArtOfReduction: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
        threshold: 0.1,
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="art-of-reduction" 
      ref={sectionRef} 
      className="py-32 bg-transparent relative overflow-hidden"
    >
      {/* White background with wide radial fade effect - needs higher z-index than canvas (1) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background: 'radial-gradient(ellipse 80% 100% at center, white 0%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.2) 80%, transparent 100%)'
        }}
      />
      
      <div className="section-container relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            ref={titleRef} 
            className="section-title slide-up mb-12"
          >
            The Art of Reduction
          </h2>
          
          <div ref={contentRef} className="slide-up space-y-12">
            <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-lora">
              In a world of constant noise and distraction, true quality emerges from the space between thoughts. 
              The power of simplicity lies not in what is added, but in what is carefully removed.
            </p>
            
            <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-lora">
              My approach strips away the unnecessary, revealing the essential core of every project. 
              I believe that when you eliminate the excess, what remains speaks with greater clarity and resonance.
            </p>
            
            <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-lora">
              This philosophy guides everything I create, allowing the authentic voice to emerge without interference.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtOfReduction;