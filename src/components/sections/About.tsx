
import React, { useRef, useEffect } from 'react';
import { Code, Globe, Server } from 'lucide-react';

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
      icon: <Code size={24} />,
      title: "Frontend Development",
      description: "Creating responsive, intuitive user interfaces with modern frameworks.",
      items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      icon: <Server size={24} />,
      title: "Backend Development",
      description: "Building robust server-side applications and APIs.",
      items: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB"],
    },
    {
      icon: <Globe size={24} />,
      title: "Tools & Practices",
      description: "Employing best practices and tools for efficient development.",
      items: ["Git", "CI/CD", "Docker", "Test-Driven Development", "Agile Methodologies"],
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="bg-gradient-to-br from-background to-secondary/5 py-24">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">About Me</h2>
          <p className="section-subtitle slide-up">
            With over 5 years of experience, I design and develop applications 
            that prioritize user experience, performance, and maintainability.
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
                  "I believe in creating software that not only solves problems
                  but does so with elegance and efficiency. My approach combines
                  technical expertise with an eye for design to deliver seamless
                  digital experiences."
                </p>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">
                  Software Developer
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
