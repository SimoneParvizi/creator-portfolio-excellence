
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
      <div className="fixed left-6 bottom-6 z-40 hidden md:flex flex-col items-center space-y-4 group">
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
      <div className="fixed right-6 bottom-6 z-40 hidden md:flex flex-col items-center space-y-4 group">
        {/* Email Icon - Above the line with opening animation */}
        <a
          href="mailto:contact@example.com"
          className="p-2 text-foreground/60 hover:text-red-500 transition-all duration-300 hover:scale-110 transform relative"
          aria-label="Email"
        >
          <div className="relative">
            {/* Mail envelope base */}
            <Mail 
              size={20} 
              className="transition-all duration-300"
            />
            {/* Animated flap overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute inset-0"
              >
                {/* Animated mail flap */}
                <path
                  d="m3 7 8.589-5.207a2 2 0 0 1 2.822 0L21 7"
                  className="transition-all duration-300 origin-center group-hover:rotate-12 group-hover:translate-y-[-1px]"
                  style={{
                    transformOrigin: '50% 100%'
                  }}
                />
              </svg>
            </div>
          </div>
        </a>

        {/* Divider Line with Hover Effect */}
        <div className="relative w-[1px] h-20 bg-foreground/20">
          <div className="absolute bottom-0 left-0 w-full bg-red-500 transition-all duration-500 ease-out h-0 group-hover:h-full"></div>
        </div>
      </div>
    </>
  );
};

export default FixedSocialSidebar;
