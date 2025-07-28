import React, { useEffect, useRef } from 'react';

const P5aBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const canvasRectRef = useRef<DOMRect | null>(null);
  const timeRef = useRef<number>(0);
  const specialDotIndexRef = useRef<number>(-1);
  const specialDotTimerRef = useRef<number>(0);

  // Expanded color palette with darker gray options
  const colors = [
    'rgba(200, 200, 200, 0.4)',
    'rgba(180, 180, 180, 0.3)',
    'rgba(160, 160, 160, 0.2)',
    'rgba(120, 120, 120, 0.5)', // Darker option
    'rgba(100, 100, 100, 0.6)', // Even darker option
  ];

  class Dot {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    connected: boolean;
    baseX: number;
    baseY: number;
    speed: number;
    angle: number;
    darknessFactor: number;
    darkening: boolean;
    originalOpacity: number;
    currentOpacity: number;
    opacityChangeSpeed: number;
    isSpecial: boolean;
    specialPhase: number; // 0: normal, 1: turning red, 2: still, 3: returning to normal
    originalColor: string;
    originalSize: number;
    isSquare: boolean;
    
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = Math.random() * 1 + 0.5; // Keep the small dots
      this.originalSize = this.size;
      
      // Extract color values for opacity manipulation
      const colorIndex = Math.floor(Math.random() * colors.length);
      this.color = colors[colorIndex];
      this.originalColor = this.color;
      
      // Parse the original opacity from the rgba string
      const opacityMatch = this.color.match(/[\d.]+(?=\))/);
      this.originalOpacity = opacityMatch ? parseFloat(opacityMatch[0]) : 0.3;
      this.currentOpacity = this.originalOpacity;
      
      this.vx = 0;
      this.vy = 0;
      this.connected = false; // Used to track if dot is in a line
      this.speed = Math.random() * 0.0005 + 0.0002; // Very slow movement speed
      this.angle = Math.random() * Math.PI * 2; // Random initial angle
      
      // Initialize darkness transition properties
      this.darknessFactor = 1;
      this.darkening = Math.random() > 0.7; // 30% chance to start darkening
      this.opacityChangeSpeed = Math.random() * 0.002 + 0.001; // Speed of opacity change
      
      // Special dot properties
      this.isSpecial = false;
      this.specialPhase = 0;
      this.isSquare = false;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      // Determine color based on special status
      let displayColor;
      
      if (this.isSpecial) {
        if (this.specialPhase === 1) {
          // Transitioning to red
          displayColor = `rgba(234, 56, 76, ${this.currentOpacity})`;
        } else if (this.specialPhase === 2) {
          // Fully red and still
          displayColor = `rgba(234, 56, 76, 0.8)`;
        } else if (this.specialPhase === 3) {
          // Transitioning back to normal
          displayColor = `rgba(234, 56, 76, ${this.currentOpacity})`;
        } else {
          // Normal behavior but red
          const baseColor = this.color.replace(/[\d.]+(?=\))/, this.currentOpacity.toString());
          displayColor = baseColor;
        }
      } else {
        // Regular dot with current opacity
        const baseColor = this.color.replace(/[\d.]+(?=\))/, this.currentOpacity.toString());
        displayColor = baseColor;
      }
      
      if (this.isSquare) {
        // Draw a square instead of a circle
        const squareSize = this.size * 2;
        ctx.fillStyle = displayColor;
        ctx.fillRect(this.x - squareSize/2, this.y - squareSize/2, squareSize, squareSize);
      } else {
        // Draw standard circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = displayColor;
        ctx.fill();
      }
    }
    
    update(mouse: { x: number, y: number }, time: number, width: number, height: number) {
      // Different behavior based on special status and phase
      if (this.isSpecial) {
        if (this.specialPhase === 1) {
          // Phase 1: Turning red and slowing down
          this.color = 'rgba(234, 56, 76, 0.8)'; // Red color
          
          // Gradually slow down
          this.vx *= 0.95;
          this.vy *= 0.95;
          
          // Minimal movement based on time
          const slowFactor = 0.3; // Reduced movement
          const xMovement = Math.sin(time * this.speed * slowFactor + this.angle) * 0.2;
          const yMovement = Math.sin(time * this.speed * 2 * slowFactor + this.angle) * Math.cos(time * this.speed * slowFactor + this.angle) * 0.2;
          
          this.x += this.vx + xMovement;
          this.y += this.vy + yMovement;
          
          // Update opacity to become more visible
          this.currentOpacity = Math.min(0.8, this.currentOpacity + 0.01);
        }
        else if (this.specialPhase === 2) {
          // Phase 2: Still, fully red, slightly larger, and becomes a square
          // Almost no movement
          this.vx = 0;
          this.vy = 0;
          
          // Minimal wiggle
          const tinyMovement = Math.sin(time * 0.001) * 0.05;
          this.x += tinyMovement;
          this.y += tinyMovement;
          
          // Become a square
          this.isSquare = true;
          
          // Increase size slightly (just enough to be perceptible)
          this.size = this.originalSize * 1.2;
        }
        else if (this.specialPhase === 3) {
          // Phase 3: Returning to normal
          // Gradually restore original color and shape
          this.color = this.originalColor;
          this.isSquare = false;
          
          // Gradually return to original size
          this.size = this.originalSize + (this.size - this.originalSize) * 0.9;
          
          // Start regaining normal movement
          const recoveryFactor = 0.5;
          const xMovement = Math.sin(time * this.speed * recoveryFactor + this.angle) * 0.3;
          const yMovement = Math.sin(time * this.speed * 2 * recoveryFactor + this.angle) * Math.cos(time * this.speed * recoveryFactor + this.angle) * 0.3;
          
          this.x += this.vx + xMovement;
          this.y += this.vy + yMovement;
          
          // Update opacity to return to original
          this.currentOpacity = Math.max(this.originalOpacity, this.currentOpacity - 0.01);
        }
        else {
          // Regular behavior for special dot (when not in special phases)
          this.updateRegular(mouse, time, width, height);
        }
      } else {
        // Regular behavior for normal dots
        this.updateRegular(mouse, time, width, height);
      }
      
      // Reset connected state for this frame
      this.connected = false;
    }
    
    updateRegular(mouse: { x: number, y: number }, time: number, width: number, height: number) {
      let distance = 0;
      
      // Check for active form field avoidance - avoid entire rectangular area
      const activeField = (window as any).activeFormField;
      if (activeField?.rect) {
        const fieldRect = activeField.rect;
        const avoidancePadding = 8; // Very tight padding around the form field
        
        // Convert screen coordinates to canvas coordinates
        const canvasRect = canvasRectRef.current;
        if (canvasRect) {
          const fieldLeft = fieldRect.left - canvasRect.left - avoidancePadding;
          const fieldRight = fieldRect.right - canvasRect.left + avoidancePadding;
          const fieldTop = fieldRect.top - canvasRect.top - avoidancePadding;
          const fieldBottom = fieldRect.bottom - canvasRect.top + avoidancePadding;
          
          // Check if dot is inside the expanded rectangle
          if (this.x >= fieldLeft && this.x <= fieldRight && this.y >= fieldTop && this.y <= fieldBottom) {
            // Calculate distance to nearest edge of rectangle
            const distanceToLeft = this.x - fieldLeft;
            const distanceToRight = fieldRight - this.x;
            const distanceToTop = this.y - fieldTop;
            const distanceToBottom = fieldBottom - this.y;
            
            // Find the closest edge
            const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
            const pushStrength = 1.5; // How strong the avoidance is
            
            // Push towards the closest edge
            if (minDistance === distanceToLeft) {
              // Push left
              this.vx -= pushStrength;
            } else if (minDistance === distanceToRight) {
              // Push right
              this.vx += pushStrength;
            } else if (minDistance === distanceToTop) {
              // Push up
              this.vy -= pushStrength;
            } else {
              // Push down
              this.vy += pushStrength;
            }
            
            // Add some randomness to prevent dots from getting stuck
            this.vx += (Math.random() - 0.5) * 0.5;
            this.vy += (Math.random() - 0.5) * 0.5;
          }
        }
      }
      
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 180; // Larger influence radius
      
      if (distance < maxDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (maxDistance - distance) / maxDistance;
        
        // Normal mouse interaction (scroll protection handled by using previous mouse position)
        this.vx -= Math.cos(angle) * force * 0.4;
        this.vy -= Math.sin(angle) * force * 0.4;
        
        // Dots near the mouse get much more visible
        if (distance < 80) {
          this.currentOpacity = Math.min(1.0, this.currentOpacity + 0.15);
          // Also make them slightly bigger for more visibility
          this.size = Math.min(this.originalSize * 1.8, this.size + 0.1);
        }
      }
      
      // Return size to original when not near mouse
      if (distance > 80) {
        this.size = Math.max(this.originalSize, this.size - 0.05);
      }
      
      // Add subtle time-based movement (gentle organic motion)
      // Figure 8 / infinity pattern movement
      const xMovement = Math.sin(time * this.speed + this.angle) * 0.8;
      const yMovement = Math.sin(time * this.speed * 2 + this.angle) * Math.cos(time * this.speed + this.angle) * 0.8;
      
      // Blend time-based movement with mouse interaction
      const newX = this.x + this.vx + xMovement;
      const newY = this.y + this.vy + yMovement;
      
      // Cap maximum movement per frame to prevent teleporting
      const maxMovement = 5; // Maximum pixels per frame
      const deltaX = newX - this.x;
      const deltaY = newY - this.y;
      const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (movementDistance > maxMovement) {
        const ratio = maxMovement / movementDistance;
        this.x += deltaX * ratio;
        this.y += deltaY * ratio;
      } else {
        this.x = newX;
        this.y = newY;
      }
      
      // Slow return to original position
      const returnSpeed = 0.015;
      this.x += (this.baseX - this.x) * returnSpeed;
      this.y += (this.baseY - this.y) * returnSpeed;
      
      // Apply velocity with less damping for more dramatic movement
      this.vx *= 0.75; // Even less damping for more persistence
      this.vy *= 0.75;
      
      // Random opacity transitions
      if (Math.random() < 0.002) { // Small chance to toggle darkening state
        this.darkening = !this.darkening;
      }
      
      // Update opacity based on darkening state
      if (this.darkening) {
        this.currentOpacity = Math.min(0.8, this.currentOpacity + this.opacityChangeSpeed);
        if (this.currentOpacity >= 0.8) {
          this.darkening = false;
        }
      } else {
        this.currentOpacity = Math.max(this.originalOpacity, this.currentOpacity - this.opacityChangeSpeed);
        if (this.currentOpacity <= this.originalOpacity) {
          this.darkening = Math.random() > 0.95; // 5% chance to start darkening again
        }
      }
    }
  }

  const createDots = () => {
    if (!canvasRef.current) return;
    
    const { width, height } = sizeRef.current;
    const dots: Dot[] = [];
    
    // Create a balanced grid of dots
    const gridSize = 25; // Balanced density - not too many, not too few
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        // Add some randomness to positions
        const randX = x + (Math.random() * 8 - 4);
        const randY = y + (Math.random() * 8 - 4);
        dots.push(new Dot(randX, randY));
      }
    }
    
    dotsRef.current = dots;
  };

  const handleResize = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    // Prevent resize during scroll OR touch interaction
    if (isScrollingRef.current || isTouchingRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    // Check if size actually changed to prevent unnecessary recreations
    const rect = canvas.getBoundingClientRect();
    const currentSize = sizeRef.current;
    
    // Only proceed if size actually changed (with small tolerance for floating point)
    if (Math.abs(rect.width - currentSize.width) < 1 && Math.abs(rect.height - currentSize.height) < 1) {
      return;
    }
    
    // Set display size (css pixels)
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Set actual size in memory (scaled to account for extra pixel density)
    const dpr = window.devicePixelRatio || 1;
    
    // Cache the canvas rect to prevent repeated getBoundingClientRect calls
    canvasRectRef.current = rect;
    
    // Update size refs
    sizeRef.current = {
      width: rect.width,
      height: rect.height
    };
    
    // Scale canvas and context for retina displays
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Recreate dots after resize
    createDots();
  };

  const drawLines = (ctx: CanvasRenderingContext2D, dots: Dot[]) => {
    const maxDistance = 40; // Very short connection distance for minimal lines
    
    for (let i = 0; i < dots.length; i++) {
      // Only connect to a maximum of 2 nearest dots
      let connections = 0;
      const connectedDots = [];
      
      // Find closest dots
      for (let j = 0; j < dots.length; j++) {
        if (i === j) continue;
        
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          connectedDots.push({ dot: dots[j], distance });
        }
      }
      
      // Sort by distance and take closest 2
      connectedDots.sort((a, b) => a.distance - b.distance);
      const nearest = connectedDots.slice(0, 2);
      
      // Draw lines to nearest dots
      for (const { dot, distance } of nearest) {
        // Skip lines if either dot is in the book area
        if (isInBookArea(dots[i].x, dots[i].y) || isInBookArea(dot.x, dot.y)) {
          continue;
        }
        
        // Only draw if both dots haven't exceeded connection limit
        if (!dots[i].connected || !dot.connected) {
          // Modify line opacity based on current dot opacities
          const avgOpacity = (dots[i].currentOpacity + dot.currentOpacity) / 2;
          const opacity = (1 - (distance / maxDistance)) * avgOpacity;
          
          ctx.strokeStyle = `rgba(180, 180, 180, ${opacity * 0.3})`; // Lines get darker too
          ctx.lineWidth = 0.2; // Keep extremely thin lines
          
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dot.x, dot.y);
          ctx.stroke();
          
          // Mark as connected
          dots[i].connected = true;
          dot.connected = true;
        }
      }
    }
  };

  const updateSpecialDot = (timestamp: number) => {
    const dots = dotsRef.current;
    
    // Handle special dot
    if (specialDotIndexRef.current === -1 && Math.random() < 0.001) {
      // Randomly select a dot to become special (very low probability)
      specialDotIndexRef.current = Math.floor(Math.random() * dots.length);
      specialDotTimerRef.current = timestamp;
      
      // Initialize the selected dot as special
      const specialDot = dots[specialDotIndexRef.current];
      specialDot.isSpecial = true;
      specialDot.specialPhase = 1; // Start phase 1 (turning red)
      specialDot.originalSize = specialDot.size; // Store original size
    }
    
    // If we have a special dot, update its state based on time
    if (specialDotIndexRef.current !== -1) {
      const specialDot = dots[specialDotIndexRef.current];
      const elapsed = timestamp - specialDotTimerRef.current;
      
      if (specialDot.specialPhase === 1 && elapsed > 3000) {
        // After 3 seconds, transition to phase 2 (still, square, and slightly larger)
        specialDot.specialPhase = 2;
        specialDotTimerRef.current = timestamp;
      }
      else if (specialDot.specialPhase === 2 && elapsed > 5000) {
        // After 5 seconds, transition to phase 3 (returning to normal)
        specialDot.specialPhase = 3;
        specialDotTimerRef.current = timestamp;
      }
      else if (specialDot.specialPhase === 3 && elapsed > 3000) {
        // After 3 more seconds, complete transition back to normal
        specialDot.isSpecial = false;
        specialDot.specialPhase = 0;
        specialDot.color = specialDot.originalColor;
        specialDot.isSquare = false;
        specialDot.size = specialDot.originalSize;
        specialDotIndexRef.current = -1; // Reset special dot reference
      }
    }
  };

  const lastFrameRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollStartFramesRef = useRef<number>(0);
  const isTouchingRef = useRef<boolean>(false);

  // Function to check if a dot is in the book area
  const isInBookArea = (x: number, y: number) => {
    // Only create hole when Books section is visible
    const booksSection = document.getElementById('books');
    if (!booksSection) return false;
    
    const rect = booksSection.getBoundingClientRect();
    const { width } = sizeRef.current;
    
    // Check if Books section is visible on screen
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return false;
    
    // Calculate book area relative to viewport
    const bookAreaCenterX = width * 0.3; // Book is in left column, moved slightly right
    const bookAreaCenterY = rect.top + (rect.height * 0.42); // Moved up slightly to reduce bottom space
    const bookAreaWidth = 450; // Reduced width from 500 to 450
    const bookAreaHeight = 580; // Reduced height from 650 to 580
    
    return (
      x >= bookAreaCenterX - bookAreaWidth / 2 &&
      x <= bookAreaCenterX + bookAreaWidth / 2 &&
      y >= bookAreaCenterY - bookAreaHeight / 2 &&
      y <= bookAreaCenterY + bookAreaHeight / 2
    );
  };

  const animate = (timestamp: number) => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const isMobile = window.innerWidth <= 768;
    
    // Skip first 2 animation frames when scroll starts on mobile
    if (isMobile && isScrollingRef.current && scrollStartFramesRef.current < 2) {
      scrollStartFramesRef.current++;
      rafRef.current = requestAnimationFrame(animate);
      return;
    }
    
    // Update time for organic movement patterns
    timeRef.current = timestamp;
    
    const ctx = contextRef.current;
    const { width, height } = sizeRef.current;
    
    // Clear canvas with full opacity
    ctx.clearRect(0, 0, width, height);
    
    // Update special dot state
    updateSpecialDot(timestamp);
    
    // Update and draw dots (skip dots in book area)
    dotsRef.current.forEach(dot => {
      dot.update(mouseRef.current, timeRef.current, width, height);
      
      // Only draw dot if it's not in the book area
      if (!isInBookArea(dot.x, dot.y)) {
        dot.draw(ctx);
      }
    });
    
    // Draw minimal connecting lines
    drawLines(ctx, dotsRef.current);
    
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    contextRef.current = canvasRef.current.getContext('2d');
    
    if (!contextRef.current) return;
    
    // Track mouse/touch position using cached rect with mobile stability
    const updateMousePosition = (clientX: number, clientY: number, isTouch: boolean = false) => {
      // Use cached rect instead of calling getBoundingClientRect every time
      let rect = canvasRectRef.current;
      
      // Only update rect if we don't have one cached
      if (!rect) {
        const canvas = canvasRef.current;
        if (canvas) {
          rect = canvas.getBoundingClientRect();
          canvasRectRef.current = rect;
        } else {
          return;
        }
      }
      
      const isMobile = window.innerWidth <= 768;
      const isAtTop = window.scrollY <= 10; // Small buffer for floating point precision
      
      // For mobile at the top of page, completely freeze mouse position during small movements
      if (isMobile && isAtTop && isTouch) {
        // Calculate potential new position
        const potentialMousePos = {
          x: Math.round(clientX - rect.left),
          y: Math.round(clientY - rect.top)
        };
        
        // Calculate movement distance
        const dx = Math.abs(potentialMousePos.x - mouseRef.current.x);
        const dy = Math.abs(potentialMousePos.y - mouseRef.current.y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only update if movement is > 5 pixels (more aggressive threshold)
        if (distance > 5) {
          prevMouseRef.current = { ...mouseRef.current };
          mouseRef.current = potentialMousePos;
        }
        // Otherwise, completely ignore the touch movement
        return;
      }
      
      // Normal behavior for other cases
      const newMousePos = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
      
      // Store previous position before updating
      prevMouseRef.current = { ...mouseRef.current };
      
      // Update mouse position
      mouseRef.current = newMousePos;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouchingRef.current = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY, true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY, true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      isTouchingRef.current = false;
    };
    
    // Simple scroll state tracking with frame skipping
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      
      // Reset frame counter when new scroll starts
      if (!isScrollingRef.current && isMobile) {
        scrollStartFramesRef.current = 0;
      }
      
      isScrollingRef.current = true;
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        scrollStartFramesRef.current = 0; // Reset for next scroll
      }, 150);
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Start animation
    rafRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};

export default P5aBackground;
