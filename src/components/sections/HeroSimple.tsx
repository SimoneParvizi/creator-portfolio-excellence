import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/ui/AnimatedText';
import { gsap } from 'gsap';

const HeroSimple: React.FC = () => {
  console.log('HeroSimple component rendering...');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introTextRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Canvas animation for dots
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize the canvas to fill the browser window dynamically
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initCircles();
    }

    window.addEventListener('resize', resizeCanvas);

    let circles: any[] = [];
    const circleSpacing = 20;
    const baseRadius = 0.6;

    // Initialize the grid of circles
    function initCircles() {
      circles = [];
      const cols = Math.floor(canvas.width / circleSpacing) + 1;
      const rows = Math.floor(canvas.height / circleSpacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          circles.push({
            x: i * circleSpacing,
            y: j * circleSpacing,
            radius: baseRadius,
            targetRadius: baseRadius
          });
        }
      }
    }

    resizeCanvas();

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    // Update mouse position
    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach(function(circle) {
        const dx = circle.x - mouseX;
        const dy = circle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxRadius = 10;
        const minRadius = baseRadius;
        const influenceRadius = 125;

        // Calculate target radius based on distance to mouse
        if (distance < influenceRadius) {
          const ratio = (influenceRadius - distance) / influenceRadius;
          circle.targetRadius = minRadius + ratio * (maxRadius - minRadius);
        } else {
          circle.targetRadius = minRadius;
        }

        // Smooth transition for the trail effect
        const easing = 0.05;
        circle.radius += (circle.targetRadius - circle.radius) * easing;

        // Draw the circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Text animation
    const introText = introTextRef.current;
    if (introText) {
      const words = (introText.getAttribute("data-words") || "").split(",");
      let currentIndex = 0;

      function animateWord() {
        if (!introText) return;
        
        const currentWord = words[currentIndex].trim();
        introText.innerHTML = currentWord;
        
        // Split text into characters for animation, preserving spaces
        const chars = currentWord.split('').map(char => {
          if (char === ' ') {
            return `<span style="display: inline-block; width: 0.3em;">&nbsp;</span>`;
          }
          return `<span style="display: inline-block;">${char}</span>`;
        }).join('');
        introText.innerHTML = chars;
        
        const charElements = introText.querySelectorAll('span');

        const tl = gsap.timeline({
          onComplete: () => {
            currentIndex = (currentIndex + 1) % words.length;
            setTimeout(animateWord, 100);
          }
        });

        tl.set(introText, { opacity: 1 });

        tl.fromTo(
          charElements,
          { filter: "blur(12.5px)" },
          {
            duration: 1.2,
            filter: "blur(0px)",
            stagger: 0.06,
            ease: "power2.out"
          }
        )
        .fromTo(
          charElements,
          {
            opacity: 0,
            x: -100,
            y: 15,
            rotateY: 30,
            rotateX: -55,
            skewX: 25,
            skewY: 30,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            skewX: 0,
            skewY: 0,
            stagger: 0.05,
            ease: "power2.out"
          },
          "<0.1"
        )
        .fromTo(
          charElements,
          { filter: "blur(0px)" },
          {
            filter: "blur(12.5px)",
            stagger: 0.035,
            ease: "power2.in"
          },
          ">2"
        )
        .fromTo(
          charElements,
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            rotateX: 0
          },
          {
            opacity: 0,
            x: 70,
            y: -15,
            rotateY: 20,
            rotateX: 55,
            stagger: 0.06,
            ease: "power2.in"
          },
          "<+0.1"
        );
        
        gsap.set(charElements, {
          opacity: 0
        });
      }
      
      animateWord();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section id="hero" className="relative min-h-[85vh] md:min-h-screen flex items-start md:items-center pt-8 md:pt-0 bg-transparent">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <span className="text-sm font-medium text-foreground/70 font-lora">
              creative solo developer
            </span>
          </div>
          
          <div className="intro-section">
            <div className="wrapper">
              <h1>
                <span>Creating <br /></span>your <em>next</em> <br /> 
                <span ref={introTextRef} className="intro-text" data-words="Website,Idea,Product,Pipeline,MVP,Vision" style={{marginTop: '15px', display: 'inline-block'}}>Website</span>
              </h1>
            </div>
          </div>
          
          <canvas ref={canvasRef} id="circleCanvas"></canvas>
          
          <div className="mb-12">
            <p className="text-lg md:text-xl max-w-2xl mb-6 text-balance font-lora">
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

export default HeroSimple;