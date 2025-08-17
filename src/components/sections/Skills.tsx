
import React, { useRef, useEffect, useState } from 'react';
import { Code, Globe, Server, Database, Cloud, BookOpen, Palette } from 'lucide-react';

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, title, description, items, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBullets, setShowBullets] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('in-view');
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
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
  }, [index]);

  // Handle staggered transition
  useEffect(() => {
    if (isExpanded) {
      // Hide description first, then show bullets
      setShowDescription(false);
      setShowBullets(false);
      requestAnimationFrame(() => {
        setTimeout(() => setShowBullets(true), 300);
      });
    } else {
      // Hide bullets first, then show description
      setShowBullets(false);
      setTimeout(() => setShowDescription(true), 300);
    }
  }, [isExpanded]);

  // Special cards for all skills with different shapes
  if (index === 0 || index === 1 || index === 2) {
    // Determine shape based on index
    let shapeElement;
    if (index === 0) {
      // Circle for Website Development
      shapeElement = (
        <div 
          className="absolute h-full w-full rounded-full bg-black transition-all duration-500"
          style={{ 
            marginTop: '-330px', 
            marginLeft: '200px' 
          }}
        />
      );
    } else if (index === 1) {
      // True triangle for DevOps using CSS borders - larger and tilted
      shapeElement = (
        <div 
          className="absolute transition-all duration-500"
          style={{ 
            marginTop: '-350px', 
            marginLeft: '140px',
            width: '0',
            height: '0',
            borderLeft: '185px solid transparent',
            borderRight: '185px solid transparent',
            borderBottom: '300px solid black',
            transform: 'rotate(-20deg)'
          }}
        />
      );
    } else {
      // Triangle for Machine Learning
      shapeElement = (
        <div 
          className="absolute h-full w-full bg-black rounded-lg transform rotate-12 transition-all duration-500"
          style={{ 
            marginTop: '-380px', 
            marginLeft: '170px'
          }}
        />
      );
    }
    return (
      <div
        ref={cardRef}
        className="slide-up relative flex items-center justify-center flex-col h-96 w-96 rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Dynamic shape based on index */}
        {shapeElement}
        
        {/* Title */}
        <h3 
          className={`absolute left-0 top-0 m-5 text-3xl font-semibold uppercase tracking-widest text-white font-lora transition-all duration-500 ${isExpanded ? 'mb-2' : ''}`}
          style={{ mixBlendMode: 'difference' }}
        >
          {title}
        </h3>
        
        {/* Description with fade transition */}
        <p 
          className={`absolute left-0 bottom-0 m-5 mb-16 text-base text-white font-lora transition-opacity duration-500 ${showDescription ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ mixBlendMode: 'difference' }}
        >
          {description}
        </p>
        
        {/* Bullet points with fade transition */}
        <div className={`absolute left-0 bottom-0 m-5 mb-16 transition-all duration-500 ease-in-out transform ${showBullets ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-xs flex items-start font-lora text-black">
                <span className="mr-2 text-black/80">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* More button */}
        <div className="absolute right-0 bottom-0 m-5">
          <span 
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer bg-black text-white text-lg rounded-full shadow-lg font-lora transition-all duration-300 ease-in-out hover:scale-105 relative inline-block"
            style={{ 
              width: '60px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <span 
              className={`absolute transition-opacity duration-300 ease-in-out ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              less
            </span>
            <span 
              className={`absolute transition-opacity duration-300 ease-in-out ${
                !isExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              skills
            </span>
          </span>
        </div>
      </div>
    );
  }

  // Regular card for other skills
  return (
    <div
      ref={cardRef}
      className="slide-up p-6 rounded-2xl border border-border/40 bg-card/90 hover:border-border/60 transition-all duration-300 relative"
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 mb-5 text-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 font-lora">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 font-lora">{description}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex items-start font-lora">
            <span className="mr-2 text-foreground/60">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  const skills = [
    {
      icon: <Palette size={24} />,
      title: "Website Development",
      description: "Creating modern, intuitive websites that engage your audience.",
      items: ["React & TypeScript", "Tailwind CSS", "Responsive Design", "Modern Animations", "Component Libraries", "Interactive UI Elements"],
    },
    {
      icon: <Cloud size={24} />,
      title: "DevOps",
      description: "Handling the deployment and scaling infrastructure for production systems.",
      items: ["CI/CD Pipelines", "Kubernetes", "Docker", "Infrastructure as Code", "Cloud Deployment", "Auto-scaling Systems"],
    },
    {
      icon: <Database size={24} />,
      title: "Machine Learning",
      description: "Building and launching ML models that solve real problems. Your problems.",
      items: ["Model Training", "Model Serving", "Feature Engineering", "Data Processing", "ML Monitoring", "Experiment Tracking"],
    },
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-12 md:py-24 bg-transparent">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">My Expertise</h2>
          <p className="section-subtitle slide-up">What I can do for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {skills.map((skill, index) => (
            <div key={index}>
              <SkillCard
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
                items={skill.items}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
