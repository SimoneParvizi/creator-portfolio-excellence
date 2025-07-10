
import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const FixedSocialSidebar = () => {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/SimoneParvizi',
      label: 'GitHub',
      color: 'hover:text-gray-800'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/simone-parvizi/',
      label: 'LinkedIn',
      color: 'hover:text-blue-600'
    },
    {
      icon: Twitter,
      href: 'https://twitter.com',
      label: 'Twitter',
      color: 'hover:text-blue-400'
    }
  ];

  return (
    <>
      {/* Social Icons - Left Side */}
      <div className="fixed left-6 bottom-6 z-30 hidden md:flex flex-col items-center space-y-4 group">
        {/* Social Icons */}
        <div className="flex flex-col space-y-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 text-foreground/60 ${social.color} transition-all duration-300 hover:scale-110 transform`}
              aria-label={social.label}
            >
              <social.icon size={20} />
            </a>
          ))}
        </div>

        {/* Divider Line with Hover Effect */}
        <div className="relative w-[1px] h-20 bg-foreground/20">
          <div className="absolute bottom-0 left-0 w-full bg-red-500 transition-all duration-500 ease-out h-0 group-hover:h-full"></div>
        </div>
      </div>

      {/* Email - Right Side */}
      <div className="fixed right-6 bottom-6 z-30 hidden md:flex flex-col items-center space-y-4 group">
        {/* Email Icon - Above the line */}
        <a
          href="mailto:parvizi.simone@gmail.com"
          className="p-2 text-foreground/60 hover:text-red-500 transition-all duration-300 hover:scale-110 transform"
          aria-label="Email"
        >
          <Mail size={20} />
        </a>

        {/* Divider Line with Hover Effect - 20% shorter */}
        <div className="relative w-[1px] h-16 bg-foreground/20">
          <div className="absolute bottom-0 left-0 w-full bg-red-500 transition-all duration-500 ease-out h-0 group-hover:h-full"></div>
        </div>
      </div>
    </>
  );
};

export default FixedSocialSidebar;
