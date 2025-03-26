
import React, { useRef, useEffect } from 'react';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visionBoardRef = useRef<HTMLDivElement>(null);

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

  const visionBoardImages = [
    {
      src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
      alt: "ML Infrastructure",
      caption: "Building scalable ML infrastructure",
      size: "medium",
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
      size: "medium",
      position: "bottom-left"
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      alt: "Knowledge Sharing",
      caption: "Sharing knowledge and mentoring",
      size: "small",
      position: "center-right"
    },
    {
      src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2070&auto=format&fit=crop",
      alt: "Technical Writing",
      caption: "Documenting best practices",
      size: "small",
      position: "bottom-right"
    },
    {
      src: "https://images.unsplash.com/photo-1581093199926-4ef5e4832bd1?q=80&w=2070&auto=format&fit=crop",
      alt: "AI Solutions",
      caption: "Exploring AI capabilities",
      size: "large",
      position: "center-left"
    },
    // Adding more images
    {
      src: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Pipeline Architecture",
      caption: "Building robust data pipelines",
      size: "medium",
      position: "center-top"
    },
    {
      src: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
      alt: "Containerization",
      caption: "Containerizing ML applications",
      size: "medium",
      position: "center-bottom"
    },
    {
      src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop",
      alt: "DevOps Culture",
      caption: "Promoting DevOps culture",
      size: "small",
      position: "top-center"
    },
    {
      src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Science",
      caption: "Data science excellence",
      size: "small",
      position: "bottom-center"
    }
  ];

  // Function to determine the classes based on image size and position
  const getImageClasses = (size: string, position: string) => {
    let sizeClass = "";
    
    // Size classes
    switch(size) {
      case "small":
        sizeClass = "col-span-1 row-span-1";
        break;
      case "medium":
        sizeClass = "col-span-1 row-span-2";
        break;
      case "large":
        sizeClass = "col-span-2 row-span-2";
        break;
      default:
        sizeClass = "col-span-1 row-span-1";
    }
    
    return `${sizeClass} overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300`;
  };

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">About Me</h2>
          <p className="section-subtitle slide-up">
            What a better way than show it
          </p>
        </div>

        {/* Vision Board - Enhanced Mosaic Layout */}
        <div 
          ref={visionBoardRef} 
          className="slide-up"
        >
          <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[800px]">
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
