
import React, { useEffect, useState } from 'react';
import AnimatedText from '../ui/AnimatedText';
import ScrollIndicator from '../ui/ScrollIndicator';

const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent pointer-events-none"></div>
      
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div 
            className={`mb-6 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="inline-block py-1 px-3 rounded-full text-sm font-medium text-foreground/80 bg-foreground/5 border border-foreground/10 backdrop-blur-sm mb-4">
              Software Developer
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight mb-8">
            <AnimatedText 
              text="Creating digital" 
              className="block"
              delay={300}  
            />
            <AnimatedText 
              text="experiences that" 
              className="block"
              delay={500}
            />
            <AnimatedText 
              text="perform & inspire" 
              className="block"
              delay={700}
            />
          </h1>
          
          <div 
            className={`transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 text-balance">
              I'm a passionate software developer specializing in creating elegant, 
              high-performance applications with meticulous attention to detail.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="#projects" 
                className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background shadow transition-colors hover:bg-foreground/80"
              >
                View My Work
              </a>
              <a 
                href="#contact" 
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background/70 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollIndicator />
    </section>
  );
};

export default Hero;
