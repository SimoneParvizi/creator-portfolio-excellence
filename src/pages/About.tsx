
import React from 'react';
import Navbar from '../components/layout/Navbar';
import About from '../components/sections/About';
import P5aBackground from '../components/ui/P5aBackground';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white">
      <P5aBackground />
      <Navbar />
      <main className="pt-24">
        <About />
      </main>
      <footer className="py-8 text-center text-black/60 text-sm relative z-10 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Simone Parvizi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
