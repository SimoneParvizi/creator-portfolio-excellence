import React from 'react';

const AnimatedGradientBackground: React.FC = () => {
  return (
    <>
      <style jsx>{`
        @property --blink-opacity {
          syntax: "<number>";
          inherits: false;
          initial-value: 1;
        }

        @keyframes blink-animation {
          0%,
          100% {
            opacity: var(--blink-opacity, 1);
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes smoothBg {
          from {
            background-position: 50% 50%, 50% 50%;
          }
          to {
            background-position: 350% 50%, 350% 50%;
          }
        }

        .animated-gradient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          
          --stripe-color: #fff;
          --stripes: repeating-linear-gradient(
            100deg,
            var(--stripe-color) 0%,
            var(--stripe-color) 7%,
            transparent 10%,
            transparent 12%,
            var(--stripe-color) 16%
          );

          --logo-rainbow: repeating-linear-gradient(
            100deg,
            #ef4444 10%,    /* Red */
            #f59e0b 20%,    /* Yellow/Amber */
            #3b82f6 30%,    /* Blue */
            #10b981 40%,    /* Green/Emerald */
            #ef4444 50%,    /* Red */
            #f59e0b 60%,    /* Yellow/Amber */
            #3b82f6 70%,    /* Blue */
            #10b981 80%     /* Green/Emerald */
          );

          background-image: var(--stripes), var(--logo-rainbow);
          background-size: 300%, 200%;
          background-position: 50% 50%, 50% 50%;
          filter: blur(10px) invert(100%);
          mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);
        }

        .animated-gradient-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: var(--stripes), var(--logo-rainbow);
          background-size: 200%, 100%;
          animation: smoothBg 60s linear infinite;
          background-attachment: fixed;
          mix-blend-mode: difference;
        }

        /* Variant for darker themed pages */
        .animated-gradient-bg.dark-variant {
          --stripe-color: #000;
          filter: blur(10px) opacity(50%) saturate(200%);
        }

        .animated-gradient-bg.dark-variant::after {
          filter: blur(10px) opacity(50%) saturate(200%);
        }
      `}</style>
      <div className="animated-gradient-bg" />
    </>
  );
};

export const AnimatedGradientBackgroundDark: React.FC = () => {
  return (
    <>
      <style jsx>{`
        @property --blink-opacity {
          syntax: "<number>";
          inherits: false;
          initial-value: 1;
        }

        @keyframes blink-animation {
          0%,
          100% {
            opacity: var(--blink-opacity, 1);
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes smoothBg {
          from {
            background-position: 50% 50%, 50% 50%;
          }
          to {
            background-position: 350% 50%, 350% 50%;
          }
        }

        .animated-gradient-bg-dark {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          
          --stripe-color: #000;
          --stripes: repeating-linear-gradient(
            100deg,
            var(--stripe-color) 0%,
            var(--stripe-color) 7%,
            transparent 10%,
            transparent 12%,
            var(--stripe-color) 16%
          );

          --logo-rainbow: repeating-linear-gradient(
            100deg,
            #ef4444 10%,    /* Red */
            #f59e0b 20%,    /* Yellow/Amber */
            #3b82f6 30%,    /* Blue */
            #10b981 40%,    /* Green/Emerald */
            #ef4444 50%,    /* Red */
            #f59e0b 60%,    /* Yellow/Amber */
            #3b82f6 70%,    /* Blue */
            #10b981 80%     /* Green/Emerald */
          );

          background-image: var(--stripes), var(--logo-rainbow);
          background-size: 300%, 200%;
          background-position: 50% 50%, 50% 50%;
          filter: blur(10px) opacity(50%) saturate(200%);
          mask-image: radial-gradient(ellipse at 100% 0%, white 40%, transparent 70%);
        }

        .animated-gradient-bg-dark::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: var(--stripes), var(--logo-rainbow);
          background-size: 200%, 100%;
          animation: smoothBg 60s linear infinite;
          background-attachment: fixed;
          mix-blend-mode: difference;
          filter: blur(10px) opacity(50%) saturate(200%);
        }
      `}</style>
      <div className="animated-gradient-bg-dark" />
    </>
  );
};

export default AnimatedGradientBackground;