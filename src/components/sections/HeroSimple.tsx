import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSimple: React.FC = () => {
  console.log('HeroSimple component rendering...');
  
  return (
    <section id="hero" className="relative min-h-screen flex items-start md:items-center pt-8 md:pt-0 bg-transparent">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-3">
            <div className="inline-block py-1 px-3 rounded-full text-sm font-medium text-foreground/80 bg-foreground/5 border border-foreground/10 backdrop-blur-sm mb-4">
              Solo Developer
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight mb-8">
            <span className="block mb-2">Creating digital</span>
            <span className="block mb-2">experiences that</span>
            <span className="block">perform & inspire</span>
          </h1>
          
          <div className="mb-12">
            <p className="text-lg md:text-xl max-w-2xl mb-12 text-balance font-lora">
              I build Websites, MLOps systems and Infrastructure that help you succeed.
            </p>

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSimple;