import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface AnimatedBookProps {
  bookCover: string;
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

const AnimatedBook: React.FC<AnimatedBookProps> = ({ 
  bookCover, 
  title, 
  subtitle, 
  description,
  className = "" 
}) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!bookRef.current) return;

    const book = bookRef.current;
    const bookImage = book.querySelector('.book-image') as HTMLElement;
    const bookEffect = book.querySelector('.book-effect') as HTMLElement;
    const bookLight = book.querySelector('.book-light') as HTMLElement;
    const pages = book.querySelectorAll('.book-page') as NodeListOf<HTMLElement>;
    const bookShadow = book.querySelector('.book-shadow') as HTMLElement;

    // Set initial states
    gsap.set(bookImage, {
      boxShadow: "rgba(0,0,0,0.15) 10px 5px 20px, rgba(0,0,0,0.15) 20px 0px 30px"
    });

    gsap.set(bookLight, {
      opacity: 0.1
    });

    gsap.set(pages, {
      x: 0
    });

    // Create hover animation timeline
    const hoverTimeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.7,
        ease: "power2.out"
      }
    });

    // Book cover animation
    hoverTimeline.to(bookImage, {
      translateX: -10,
      scaleX: 0.96,
      boxShadow: "rgba(0,0,0,0.35) 20px 5px 20px, rgba(0,0,0,0.15) 30px 0px 30px"
    }, 0);

    // Shadow animation
    hoverTimeline.to(bookShadow, {
      width: "130px",
      opacity: 0.8
    }, 0);

    // Effect animation
    hoverTimeline.to(bookEffect, {
      marginLeft: "10px"
    }, 0);

    // Light effect animation
    hoverTimeline.to(bookLight, {
      opacity: 0.2
    }, 0);

    // Page animations
    if (pages.length >= 3) {
      hoverTimeline.to(pages[0], {
        x: "2px",
        ease: "power1.inOut"
      }, 0);

      hoverTimeline.to(pages[1], {
        x: "0px", 
        ease: "power1.inOut"
      }, 0);

      hoverTimeline.to(pages[2], {
        x: "-2px",
        ease: "power1.inOut"
      }, 0);
    }

    timelineRef.current = hoverTimeline;

    return () => {
      hoverTimeline.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    timelineRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    timelineRef.current?.reverse();
  };

  return (
    <div className={`animated-book-container ${className}`}>
      <div 
        ref={bookRef}
        className="book-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Book Shadow */}
        <div className="book-shadow"></div>
        
        {/* Book Container */}
        <div className="book-container">
          <div className="book-cover">
            {/* Back Cover */}
            <div className="book-back-cover"></div>
            
            {/* Inside Pages */}
            <div className="book-inside">
              <div className="book-page"></div>
              <div className="book-page"></div>
              <div className="book-page"></div>
            </div>
            
            {/* Front Cover with Image */}
            <div className="book-image">
              <img src={bookCover} alt={title} />
              <div className="book-effect"></div>
              <div className="book-light"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Information */}
      {(title || subtitle || description) && (
        <div className={`book-info transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
          {title && <h3 className="book-title">{title}</h3>}
          {subtitle && <div className="book-subtitle">{subtitle}</div>}
          {description && <p className="book-description">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default AnimatedBook;