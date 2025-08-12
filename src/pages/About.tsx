
import React from 'react';
import Navbar from '../components/layout/Navbar';
import About from '../components/sections/About';
import P5aBackground from '../components/ui/P5aBackground';

const AboutPage: React.FC = () => {
  return (
    <div className="h-screen relative overflow-hidden bg-white">
      <P5aBackground />
      <Navbar />
      <main className="pt-24">
        <About />
      </main>
    </div>
  );
};

export default AboutPage;
