
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Booking from '../components/sections/Booking';
import P5aBackground from '../components/ui/P5aBackground';

const BookingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white">
      <P5aBackground />
      <Navbar />
      <main className="pt-24">
        <Booking />
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm relative z-10 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Simone Parvizi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BookingPage;
