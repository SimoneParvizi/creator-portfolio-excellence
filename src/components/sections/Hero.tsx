
import React, { useEffect, useState } from 'react';
import AnimatedText from '../ui/AnimatedText';
import MouseScrollIndicator from '../ui/MouseScrollIndicator';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  console.log('Hero component rendering...');
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    console.log('Hero useEffect running...');
    // Force loaded state to be true after component mounts
    setLoaded(true);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent pointer-events-none"></div>
      
      <MouseScrollIndicator />
      
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div 
            className={`mb-6 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="inline-block py-1 px-3 rounded-full text-sm font-medium text-foreground/70 bg-foreground/5 border border-foreground/10 backdrop-blur-sm mb-4">
              Solo Developer
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight mb-8">
            <span className="reveal-text block mb-2">
              Built to work
            </span>
            <span className="reveal-text burgundy block">
              Built to last
            </span>
          </h1>
          
          <div 
            className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '1000ms' }}
          >
            <p className="text-lg md:text-xl max-w-2xl mb-12 text-balance font-lora">
              I create Websites, MLOps systems and Infrastructure so you don't have to worry about it
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a href="#projects" className="font-lora underline text-foreground hover:text-foreground/80 transition-colors">
                view my work
              </a>
              <Button 
                asChild
                variant="ghost" 
                className="elegant-contact-btn px-8 font-lora"
              >
                <a href="#contact">contact me</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
