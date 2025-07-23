import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/ui/AnimatedText';

const HeroSimple: React.FC = () => {
  console.log('HeroSimple component rendering...');
  
  useEffect(() => {
    // First phase: Move elements to make space
    const timer1 = setTimeout(() => {
      const badgeElement = document.getElementById('solo-badge');
      const contentElement = document.getElementById('hero-content');
      
      if (badgeElement && contentElement) {
        badgeElement.style.transform = 'translateY(-20px)';
        contentElement.style.transform = 'translateY(20px)';
      }
    }, 800);
    
    // Second phase: Show main title
    const timer2 = setTimeout(() => {
      const titleElement = document.getElementById('hero-title');
      if (titleElement) {
        titleElement.style.opacity = '1';
        titleElement.style.height = 'auto';
      }
    }, 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  return (
    <section id="hero" className="relative min-h-screen flex items-start md:items-center pt-8 md:pt-0 bg-transparent">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-1 transition-transform duration-700 ease-out" id="solo-badge">
            <AnimatedText delay={200} className="inline-block">
              <div className="inline-block py-1 px-3 rounded-full text-sm font-medium text-foreground/80 bg-foreground/5 border border-foreground/10 backdrop-blur-sm mb-2">
                Solo Developer
              </div>
            </AnimatedText>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight mb-8 opacity-0 h-0 overflow-hidden transition-all duration-700 ease-out" style={{ transitionDelay: '1200ms' }} id="hero-title">
            <AnimatedText 
              text="Creating digital" 
              className="block mb-2" 
              delay={1200} 
            />
            <AnimatedText 
              text="experiences that" 
              className="block mb-2" 
              delay={1400} 
            />
            <AnimatedText 
              text="perform & inspire" 
              className="block" 
              delay={1600} 
            />
          </h1>
          
          <div className="mt-1 mb-12 transition-transform duration-700 ease-out" id="hero-content">
            <AnimatedText delay={400}>
              <p className="text-lg md:text-xl max-w-2xl mb-12 text-balance font-lora">
                I build Websites, MLOps systems and Infrastructure that help you succeed.
              </p>
            </AnimatedText>

            <AnimatedText delay={600}>
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild
                  variant="outline" 
                  className="h-11 px-8"
                >
                  <a href="#projects">View My Work</a>
                </Button>
                <Button 
                  asChild
                  variant="default" 
                  className="h-11 px-8"
                >
                  <a href="#contact">Contact Me</a>
                </Button>
              </div>
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSimple;