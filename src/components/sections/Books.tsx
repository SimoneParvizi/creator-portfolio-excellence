
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import TestimonialCarousel from '../ui/TestimonialCarousel';

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
    <section id="books" ref={sectionRef} className="py-20 bg-gradient-to-b from-background via-secondary/5 to-background relative z-10">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 ref={titleRef} className="section-title slide-up">My Book</h2>
          <p className="section-subtitle slide-up font-antonia">
            Sharing knowledge and experience through practical, actionable insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="slide-up">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden shadow-xl border border-border/40">
              <img 
                src="https://placehold.co/600x800/f5f5f5/222?text=Book+Cover" 
                alt="MLOps in Practice" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="slide-up">
            <h3 className="text-2xl font-semibold mb-4">MLOps in Practice</h3>
            <p className="text-muted-foreground mb-6 font-antonia">
              A comprehensive guide to implementing MLOps in your organization. Learn how to build 
              scalable ML pipelines, automate deployment, monitor models in production, and 
              foster collaboration between data scientists and operations teams.
            </p>
            
            <div className="space-y-4 mb-6 font-antonia">
              <div className="flex items-start">
                <span className="mr-2 text-foreground/60">•</span>
                <span>Real-world case studies and practical examples</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-foreground/60">•</span>
                <span>Infrastructure design patterns for ML systems</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-foreground/60">•</span>
                <span>CI/CD pipelines for ML models</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 text-foreground/60">•</span>
                <span>Monitoring and observability strategies</span>
              </div>
            </div>
            
            <Button className="gap-2">
              Get the Book <ExternalLink size={16} />
            </Button>
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
