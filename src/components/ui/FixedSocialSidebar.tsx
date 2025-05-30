
import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const FixedSocialSidebar = () => {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com',
      label: 'GitHub'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com',
      label: 'LinkedIn'
    },
    {
      icon: Twitter,
      href: 'https://twitter.com',
      label: 'Twitter'
    }
  ];

  return (
    <div className="fixed left-6 bottom-6 z-40 hidden md:flex flex-col items-center space-y-4">
      {/* Social Icons */}
      <div className="flex flex-col space-y-3">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-foreground/60 hover:text-foreground transition-colors duration-300 hover:scale-110 transform"
            aria-label={social.label}
          >
            <social.icon size={20} />
          </a>
        ))}
      </div>

      {/* Divider Line */}
      <div className="w-[1px] h-20 bg-foreground/20"></div>

      {/* Email */}
      <a
        href="mailto:contact@example.com"
        className="p-2 text-foreground/60 hover:text-foreground transition-colors duration-300 hover:scale-110 transform"
        aria-label="Email"
      >
        <Mail size={20} />
      </a>
    </div>
  );
};

export default FixedSocialSidebar;
