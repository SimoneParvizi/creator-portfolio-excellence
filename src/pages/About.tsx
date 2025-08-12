
import React from 'react';
import Navbar from '../components/layout/Navbar';
import About from '../components/sections/About';
import P5aBackground from '../components/ui/P5aBackground';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen md:h-screen relative overflow-x-hidden md:overflow-hidden bg-white">
      <P5aBackground />
      <Navbar />
      <main className="min-h-screen md:h-full">
        <About />
      </main>
    </div>
  );
};

export default AboutPage;
