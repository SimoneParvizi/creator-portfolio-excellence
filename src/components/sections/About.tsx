
import React, { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visionBoardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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

    if (visionBoardRef.current) {
      observer.observe(visionBoardRef.current);
    }

    return () => {
      observer.disconnect(); // This is more reliable than individually unobserving
    };
  }, []);

  // Reduced the number of images to 7 and made them larger
  const visionBoardImages = [
    {
      src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
      alt: "ML Infrastructure",
      caption: "Building scalable ML infrastructure",
      size: "xl",
      position: "top-left"
    },
    {
      src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
      alt: "Team Collaboration",
      caption: "Fostering collaboration between teams",
      size: "xl",
      position: "top-right"
    },
    {
      src: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=2070&auto=format&fit=crop",
      alt: "Cloud Solutions",
      caption: "Designing cloud-native solutions",
      size: "xl",
      position: "bottom-left"
    },
    {
      src: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Pipeline Architecture",
      caption: "Building robust data pipelines",
      size: "xl",
      position: "center-top"
    },
    {
      src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Science",
      caption: "Data science excellence",
      size: "xl",
      position: "bottom-center"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
      alt: "Code Quality",
      caption: "Maintaining high code quality",
      size: "xl",
      position: "top-right-corner"
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop",
      alt: "Productivity",
      caption: "Optimizing work environments",
      size: "xl",
      position: "bottom-right-corner"
    }
  ];

  // Function to determine the classes based on image size and position
  const getImageClasses = (size: string) => {
    // Larger size classes for bigger images
    switch(size) {
      case "xl":
        return "col-span-3 row-span-3 md:col-span-4 md:row-span-4";
      default:
        return "col-span-3 row-span-3 md:col-span-4 md:row-span-4";
    }
  };

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">About Me</h2>
          <p className="section-subtitle slide-up">
            What a better way than to show it
          </p>
        </div>

        {/* Vision Board - Redesigned layout with fewer, larger images */}
        <div 
          ref={visionBoardRef} 
          className="slide-up"
        >
          <div className="grid grid-cols-6 md:grid-cols-12 grid-rows-12 gap-4 h-[90vh]">
            {visionBoardImages.map((image, index) => (
              <div 
                key={index} 
                className={`${getImageClasses(image.size)} overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animation: `fade-in 0.8s ease-out ${index * 0.15}s both`
                }}
              >
                <div className="relative h-full w-full group">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
