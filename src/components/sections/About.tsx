
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
      observer.disconnect();
    };
  }, []);

  const visionBoardImages = [
    {
      src: "/lovable-uploads/i_came_from_abruzzo.png",
      alt: "Abruzzo Heritage",
      caption: "I came from Abruzzo",
      size: "large",
      gridPosition: "col-start-1 col-end-4 row-start-1 row-end-3"
    },
    {
      src: "/lovable-uploads/fav_place_is_petralia.png",
      alt: "Favorite Place",
      caption: "My favorite place is Petralia",
      size: "medium",
      gridPosition: "col-start-4 col-end-6 row-start-1 row-end-3"
    },
    {
      src: "/lovable-uploads/i_love_kickbox.png",
      alt: "Kickboxing",
      caption: "I love kickboxing",
      size: "small",
      gridPosition: "col-start-6 col-end-7 row-start-1 row-end-2"
    },
    {
      src: "/lovable-uploads/i_am_an_uncle.png",
      alt: "Uncle",
      caption: "I am an uncle",
      size: "small",
      gridPosition: "col-start-6 col-end-7 row-start-2 row-end-3"
    },
    {
      src: "/lovable-uploads/love_for_ancient_civilization.png",
      alt: "Ancient Civilizations",
      caption: "Love for ancient civilizations",
      size: "medium",
      gridPosition: "col-start-1 col-end-3 row-start-3 row-end-5"
    },
    {
      src: "/lovable-uploads/fav_city.png",
      alt: "Favorite City",
      caption: "My favorite city",
      size: "medium",
      gridPosition: "col-start-3 col-end-5 row-start-3 row-end-5"
    },
    {
      src: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Pipeline Architecture",
      caption: "Building robust data pipelines",
      size: "medium",
      gridPosition: "col-start-5 col-end-7 row-start-3 row-end-5"
    },
    {
      src: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
      alt: "Containerization",
      caption: "Containerizing ML applications",
      size: "large",
      gridPosition: "col-start-1 col-end-4 row-start-5 row-end-7"
    },
    {
      src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop",
      alt: "DevOps Culture",
      caption: "Promoting DevOps culture",
      size: "small",
      gridPosition: "col-start-4 col-end-5 row-start-5 row-end-6"
    },
    {
      src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      alt: "Data Science",
      caption: "Data science excellence",
      size: "small",
      gridPosition: "col-start-5 col-end-6 row-start-5 row-end-6"
    },
    {
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=2070&auto=format&fit=crop",
      alt: "Remote Work",
      caption: "Embracing remote collaboration",
      size: "medium",
      gridPosition: "col-start-4 col-end-6 row-start-6 row-end-7"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
      alt: "Code Quality",
      caption: "Maintaining high code quality",
      size: "small",
      gridPosition: "col-start-6 col-end-7 row-start-5 row-end-6"
    },
    {
      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop",
      alt: "Programming",
      caption: "Coding best practices",
      size: "small",
      gridPosition: "col-start-6 col-end-7 row-start-6 row-end-7"
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="pt-2 pb-24 relative z-10">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h2 ref={titleRef} className="section-title slide-up animate-fade-in" style={{ animation: 'fade-in 2s ease-out 0.2s both, scale-in 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.8) 0.4s both', transform: 'scale(0.5)', opacity: '0' }}>About Me</h2>
          <p className="section-subtitle slide-up">
            What a better way than to show it
          </p>
        </div>

        {/* Vision Board - Enhanced Mosaic Layout */}
        <div 
          ref={visionBoardRef} 
          className="slide-up"
        >
          <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[90vh]">
            {visionBoardImages.map((image, index) => (
              <div 
                key={index} 
                className={`${image.gridPosition} overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300`}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  animation: `fade-in 0.6s ease-out ${index * 0.08}s both`
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
