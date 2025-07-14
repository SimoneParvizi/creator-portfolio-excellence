
import React, { useRef, useEffect } from 'react';
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
      <p className="text-muted-foreground text-sm mb-4 font-cordia">{description}</p>
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
      icon: <Cloud size={24} />,
      title: "MLOps & DevOps",
      description: "Scalable systems to keep your machine learning running smoothly.",
      items: ["CI/CD Pipelines", "Kubernetes", "Docker", "Infrastructure as Code", "Cloud Architecture", "ML Model Deployment"],
    },
    {
      icon: <Database size={24} />,
      title: "Machine Learning",
      description: "Building and launching ML models that solve real problems. Your problems.",
      items: ["Model Training", "Model Serving", "Feature Engineering", "Data Processing", "ML Monitoring", "Experiment Tracking"],
    },
    {
      icon: <Palette size={24} />,
      title: "Website Development",
      description: "Creating modern, intuitive websites that engage your audience.",
      items: ["React & TypeScript", "Tailwind CSS", "Responsive Design", "Modern Animations", "Component Libraries", "Interactive UI Elements"],
    },
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-24 bg-transparent">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">My Expertise</h2>
          <p className="section-subtitle slide-up font-palatino">
            I build Websites, MLOps systems and Infrastructure that help you succeed.
          </p>
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
      </div>
    </section>
  );
};

export default Skills;
