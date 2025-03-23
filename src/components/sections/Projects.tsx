
import React, { useRef, useEffect } from 'react';
import ProjectCard from '../ui/ProjectCard';

const Projects: React.FC = () => {
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

  const projects = [
    {
      title: "E-commerce Platform",
      description: "A fully featured e-commerce platform with product management, cart functionality, and payment processing.",
      tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      imageUrl: "https://placehold.co/1200x800/111/333?text=E-commerce",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Task Management App",
      description: "A productivity application for managing projects, tasks, and team collaboration.",
      tags: ["React", "Redux", "Node.js", "MongoDB"],
      imageUrl: "https://placehold.co/1200x800/111/333?text=Task+App",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Finance Dashboard",
      description: "An interactive dashboard for visualizing financial data with real-time updates and analytics.",
      tags: ["React", "D3.js", "Express", "PostgreSQL"],
      imageUrl: "https://placehold.co/1200x800/111/333?text=Dashboard",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Social Media Platform",
      description: "A social network application with profiles, posts, comments, and real-time messaging.",
      tags: ["React", "Socket.io", "Node.js", "MongoDB"],
      imageUrl: "https://placehold.co/1200x800/111/333?text=Social+Media",
      liveUrl: "#",
      githubUrl: "#",
    },
  ];

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">Selected Projects</h2>
          <p className="section-subtitle slide-up">
            Explore a collection of my recent work showcasing my skills and approach to solving real-world problems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              index={index}
              title={project.title}
              description={project.description}
              tags={project.tags}
              imageUrl={project.imageUrl}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
            />
          ))}
        </div>

        <div className="mt-16 text-center slide-up">
          <a
            href="#"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
