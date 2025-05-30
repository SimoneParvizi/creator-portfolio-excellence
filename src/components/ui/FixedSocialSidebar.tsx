
import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const FixedSocialSidebar = () => {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com',
      label: 'GitHub',
      color: 'hover:text-gray-800'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com',
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
      <div className="fixed left-6 bottom-6 z-40 hidden md:flex flex-col items-center space-y-4">
        {/* Red Glow Effect */}
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
        
        {/* Social Icons */}
        <div className="flex flex-col space-y-3 relative z-10">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 text-foreground/60 ${social.color} transition-all duration-300 hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]`}
              aria-label={social.label}
            >
              <social.icon size={20} />
            </a>
          ))}
        </div>

        {/* Divider Line */}
        <div className="w-[1px] h-20 bg-foreground/20 relative z-10"></div>
      </div>

      {/* Email - Right Side */}
      <div className="fixed right-6 bottom-6 z-40 hidden md:flex flex-col items-center space-y-4">
        {/* Red Glow Effect */}
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
        
        {/* Divider Line */}
        <div className="w-[1px] h-20 bg-foreground/20 relative z-10"></div>

        {/* Email */}
        <a
          href="mailto:contact@example.com"
          className="p-2 text-foreground/60 hover:text-red-500 transition-all duration-300 hover:scale-110 transform hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] relative z-10"
          aria-label="Email"
        >
          <Mail size={20} />
        </a>
      </div>
    </>
  );
};

export default FixedSocialSidebar;
