
import React, { useRef, useEffect } from 'react';
import { Code, Globe, Server, Database, Cloud, BookOpen } from 'lucide-react';

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, title, description, items, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={cardRef}
      className="slide-up p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm hover:border-border/60 transition-all duration-300"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 mb-5 text-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex items-start">
            <span className="mr-2 text-foreground/60">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

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

  const skills = [
    {
      icon: <Cloud size={24} />,
      title: "MLOps & DevOps",
      description: "Building robust, scalable infrastructure and CI/CD pipelines for ML systems.",
      items: ["CI/CD Pipelines", "Kubernetes", "Docker", "Infrastructure as Code", "Cloud Architecture", "ML Model Deployment"],
    },
    {
      icon: <Database size={24} />,
      title: "Machine Learning",
      description: "Developing and deploying machine learning models at scale.",
      items: ["Model Training", "Model Serving", "Feature Engineering", "Data Processing", "ML Monitoring", "Experiment Tracking"],
    },
    {
      icon: <Code size={24} />,
      title: "Software Development",
      description: "Creating responsive applications with modern technologies.",
      items: ["Python", "TypeScript", "React", "Cloud Services", "API Development", "Microservices"],
    },
  ];

  const visionBoardImages = [
    {
      src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
      alt: "ML Infrastructure",
      caption: "Building scalable ML infrastructure"
    },
    {
      src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
      alt: "Team Collaboration",
      caption: "Fostering collaboration between teams"
    },
    {
      src: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=2070&auto=format&fit=crop",
      alt: "Cloud Solutions",
      caption: "Designing cloud-native solutions"
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      alt: "Knowledge Sharing",
      caption: "Sharing knowledge and mentoring"
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">About Me</h2>
          <p className="section-subtitle slide-up">
            I'm an MLOps and DevOps specialist with extensive experience designing, implementing, and optimizing 
            machine learning pipelines and infrastructure. I help organizations build reliable, scalable systems for ML.
          </p>
        </div>

        {/* Vision Board */}
        <div 
          ref={visionBoardRef} 
          className="mb-20 slide-up"
          style={{ transitionDelay: '150ms' }}
        >
          <h3 className="text-2xl font-display font-bold mb-8 text-center">My Vision Board</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {visionBoardImages.map((image, index) => (
              <div 
                key={index} 
                className="overflow-hidden rounded-xl border border-border/40 aspect-square group hover:border-border/60 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-full w-full">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              icon={skill.icon}
              title={skill.title}
              description={skill.description}
              items={skill.items}
              index={index}
            />
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto slide-up">
          <div className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/10">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                <img
                  src="https://placehold.co/400x400/222/444?text=JD"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "I believe in creating infrastructure and systems that not only scale reliably
                  but also accelerate the ML development lifecycle. My approach combines 
                  technical expertise with practical strategies to help teams deliver ML solutions faster."
                </p>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">
                  MLOps & DevOps Specialist | Author
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
