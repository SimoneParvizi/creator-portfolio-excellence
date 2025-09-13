
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
      title: "AI Q&A Generation Platform",
      description: "An intelligent document processing system that generates study material from documents and videos.",
      tags: ["Python", "FastAPI", "OpenAI", "HuggingFace"],
      imageUrl: "https://placehold.co/1200x800/111/333?text=AI+Q%26A",
      liveUrl: "https://kiokify.com",
      githubUrl: "#",
    },
    {
      title: "spaceanomaly.com",
      description: "A webdesign study focused on aesthetics and modern design principles.",
      tags: [],
      imageUrl: "/lovable-uploads/spaceanomaly_screenshot.png",
      liveUrl: "https://spaceanomaly.com",
    },
    {
      title: "inertiagallery.com",
      description: "Interactive 3D image gallery with momentum-based distortion effects",
      tags: [],
      imageUrl: "/lovable-uploads/inertia_gallery.png",
      liveUrl: "https://inertiagallery.com",
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
    <section id="projects" className="py-24 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">Selected Projects</h2>
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

      </div>
    </section>
  );
};

export default Projects;
