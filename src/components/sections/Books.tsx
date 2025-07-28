
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
          <p className="section-subtitle slide-up font-lora">
            Sharing knowledge and experience through practical, actionable insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-stretch mb-16">
          <div className="slide-up flex justify-center">
            <AnimatedBook 
              bookCover="/lovable-uploads/book_cover.png"
            />
          </div>
          
          <div className="slide-up flex flex-col justify-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-semibold mb-6">The Junior MLE Playbook</h3>
              <p className="text-muted-foreground mb-8 font-lora text-lg leading-relaxed">
                No one told you what junior machine learning engineers do. This practical guide bridges 
                the gap between university theory and real-world ML engineering, providing the essential 
                knowledge you need to succeed in your first ML engineering role.
              </p>
              
              <div className="space-y-5 mb-8 font-lora text-base">
                <div className="flex items-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Real-world ML engineering workflows and processes</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Production ML systems and deployment strategies</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Career transition guide from university to industry</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-foreground/60 text-lg">•</span>
                  <span>Practical tools and technologies used in the field</span>
                </div>
              </div>
              
              <Button className="gap-2 text-base px-6 py-3">
                Get the Book <ExternalLink size={18} />
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
