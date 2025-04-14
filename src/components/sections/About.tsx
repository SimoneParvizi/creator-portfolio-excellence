
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
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
      if (visionBoardRef.current) {
        observer.unobserve(visionBoardRef.current);
      }
    };
  }, []);

  // Reduced number of images (removed 4) and adjusted sizes for better layout
  const visionBoardImages = [
    {
      src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
      alt: "ML Infrastructure",
      caption: "Building scalable ML infrastructure",
      size: "large",
      position: "top-left"
    },
    {
      src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
      alt: "Team Collaboration",
      caption: "Fostering collaboration between teams",
      size: "large",
      position: "top-right"
    },
    {
      src: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=2070&auto=format&fit=crop",
      alt: "Cloud Solutions",
      caption: "Designing cloud-native solutions",
      size: "large",
      position: "bottom-left"
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      alt: "Knowledge Sharing",
      caption: "Sharing knowledge and mentoring",
      size: "medium",
      position: "center-right"
    },
    {
      src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2070&auto=format&fit=crop",
      alt: "Technical Writing",
      caption: "Documenting best practices",
      size: "medium",
      position: "bottom-right"
    },
    {
      src: "https://images.unsplash.com/photo-1581093199926-4ef5e4832bd1?q=80&w=2070&auto=format&fit=crop",
      alt: "AI Solutions",
      caption: "Exploring AI capabilities",
      size: "large",
      position: "center-left"
    },
    {
      src: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Pipeline Architecture",
      caption: "Building robust data pipelines",
      size: "large",
      position: "center-top"
    },
    {
      src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Science",
      caption: "Data science excellence",
      size: "large",
      position: "bottom-center"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
      alt: "Code Quality",
      caption: "Maintaining high code quality",
      size: "large",
      position: "top-right-corner"
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop",
      alt: "Productivity",
      caption: "Optimizing work environments",
      size: "large",
      position: "bottom-right-corner"
    },
    {
      src: "https://images.unsplash.com/photo-1581093199926-4ef5e4832bd1?q=80&w=2070&auto=format&fit=crop",
      alt: "AI Research",
      caption: "Advancing AI research",
      size: "large",
      position: "middle-center"
    }
  ];

  // Function to determine the classes based on image size and position
  const getImageClasses = (size: string, position: string) => {
    let sizeClass = "";
    
    // Size classes - Increased dimensions to make images larger
    switch(size) {
      case "medium":
        sizeClass = "col-span-2 row-span-2";
        break;
      case "large":
        sizeClass = "col-span-3 row-span-3";
        break;
      default:
        sizeClass = "col-span-2 row-span-2";
    }
    
    return `${sizeClass} overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300`;
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
          <div className="grid grid-cols-9 grid-rows-8 gap-4 h-[90vh]">
            {visionBoardImages.map((image, index) => (
              <div 
                key={index} 
                className={getImageClasses(image.size, image.position)}
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
