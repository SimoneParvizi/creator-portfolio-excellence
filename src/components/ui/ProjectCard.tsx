
import React, { useRef, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  liveUrl,
  githubUrl,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

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
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`slide-up group relative overflow-hidden rounded-2xl card-glassmorphism transition-all duration-500`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10"></div>
      
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl || "https://placehold.co/1200x800/222/333?text=Project"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 max-h-16 overflow-y-auto">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs font-medium rounded-full bg-black/30 backdrop-blur-sm text-white/90 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-xs sm:text-sm line-clamp-3 mb-4">{description}</p>
        
        <div className="flex space-x-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <img src="/lovable-uploads/inverted-x.png" alt="X" className="w-6 h-6" />
            </a>
          )}
          
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <ExternalLink size={18} className="text-white" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
