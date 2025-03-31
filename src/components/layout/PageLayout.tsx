
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import P5aBackground from '../ui/P5aBackground';
import { useLocation } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Set transition state to true when location changes
    setIsTransitioning(true);
    console.log('Page transition started - moving dots left');
    
    // After a delay, set it to false to slow down the animation
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      console.log('Page transition ended - returning to normal');
    }, 1200); // 1.2 seconds for the transition animation
    
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white">
      <P5aBackground isTransitioning={isTransitioning} />
      <Navbar />
      <main className="pt-24">
        {children}
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm relative z-10 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Simone Parvizi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
