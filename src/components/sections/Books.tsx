
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import TestimonialCarousel from '../ui/TestimonialCarousel';
import AnimatedBook from '../ui/AnimatedBook';

const Books = () => {
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
        threshold: 0.1,
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  return (
    <section id="books" ref={sectionRef} className="py-20 bg-gradient-to-b from-transparent via-secondary/5 to-transparent relative z-0">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 ref={titleRef} className="section-title slide-up">My Book</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-stretch mb-16">
          <div className="slide-up flex justify-center items-start pt-16">
            <AnimatedBook 
              bookCover="/lovable-uploads/book_cover.png"
            />
          </div>
          
          <div className="slide-up flex flex-col justify-center text-center md:text-left">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-semibold mb-6">The Junior MLE Playbook</h3>
              <p className="text-foreground mb-8 font-lora text-lg leading-relaxed">
                No one tells you what junior machine learning engineers do. These exercises do. They are the training I 
                wish someone had given me, the kind that actually prepares you for work. No theory, no hype. 
                Just the reality of being a junior MLE
              </p>
              
              <div className="space-y-5 mb-8 font-lora text-base">
                <div className="flex items-start justify-center md:justify-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Real-world ML engineering workflows and processes</span>
                </div>
                <div className="flex items-start justify-center md:justify-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Production ML systems and deployment strategies</span>
                </div>
                <div className="flex items-start justify-center md:justify-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Career transition guide from university to industry</span>
                </div>
                <div className="flex items-start justify-center md:justify-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Practical tools and technologies used in the field</span>
                </div>
              </div>
              
              <Button 
                asChild
                variant="ghost" 
                className="elegant-contact-btn px-8 font-lora gap-2"
              >
                <a href="#">coming soon</a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-32 pt-12 border-t border-border/20">
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  );
};

export default Books;
