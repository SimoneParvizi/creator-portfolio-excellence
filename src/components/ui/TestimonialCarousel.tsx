
import React, { useEffect, useRef } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  image?: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "I believe in creating infrastructure and systems that not only scale reliably but also accelerate the ML development lifecycle. My approach combines technical expertise with practical strategies to help teams deliver ML solutions faster.",
    name: "Simone Parvizi",
    title: "MLOps & DevOps Specialist | Author",
    image: "https://placehold.co/400x400/222/444?text=SP"
  },
  {
    quote: "This book transformed how we approach MLOps at our organization. The practical examples and clear explanations made implementation straightforward.",
    name: "Alex Chen",
    title: "CTO | AI Solutions Inc.",
    image: "https://placehold.co/400x400/222/444?text=AC"
  },
  {
    quote: "The infrastructure patterns described in this book helped us reduce our model deployment time by 60%. A must-read for any ML engineering team.",
    name: "Maya Rodriguez",
    title: "Lead ML Engineer | DataTech",
    image: "https://placehold.co/400x400/222/444?text=MR"
  },
  {
    quote: "Combining technical depth with practical advice, this guide has become our team's go-to reference for scaling our ML operations.",
    name: "Jordan Taylor",
    title: "Director of AI Infrastructure | TechGlobal",
    image: "https://placehold.co/400x400/222/444?text=JT"
  }
];

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, name, title, image }) => {
  return (
    <Card className="p-5 rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm shadow-md h-full flex flex-col">
      <div className="mb-3 text-primary/40">
        <Quote size={24} />
      </div>
      <p className="italic text-muted-foreground mb-4 text-sm">{quote}</p>
      <div className="mt-auto flex items-center">
        {image && (
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-border/40">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </div>
    </Card>
  );
};

const TestimonialCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  
  const setApi = (api: any) => {
    apiRef.current = api;
  };
  
  useEffect(() => {
    // Start automatic smooth scrolling
    let lastTime = 0;
    const scrollSpeed = 0.4; // pixels per millisecond - adjust for faster/slower scrolling
    
    const scrollStep = (timestamp: number) => {
      if (!apiRef.current) {
        animationRef.current = requestAnimationFrame(scrollStep);
        return;
      }
      
      if (lastTime === 0) {
        lastTime = timestamp;
        animationRef.current = requestAnimationFrame(scrollStep);
        return;
      }
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Get the current scroll position
      const scrollPos = apiRef.current.scrollSnapList();
      const scrollLength = apiRef.current.scrollSnapList().length * scrollSpeed;
      
      // Scroll by a small amount based on time elapsed
      apiRef.current.scrollTo(apiRef.current.scrollProgress() + (deltaTime * scrollSpeed / 10000));
      
      // If we've reached the end, loop back to the beginning smoothly
      if (apiRef.current.canScrollNext() === false) {
        apiRef.current.scrollTo(0);
        lastTime = 0; // Reset timer to avoid a big jump
      }
      
      animationRef.current = requestAnimationFrame(scrollStep);
    };
    
    animationRef.current = requestAnimationFrame(scrollStep);
    
    // Return cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <div className="slide-up">
      <h3 className="text-2xl font-semibold mb-6 text-center">What People Are Saying</h3>
      <div className="relative" ref={carouselRef}>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {/* Duplicate testimonials for continuous scrolling effect */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="h-full">
                  <TestimonialCard {...testimonial} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative static translate-y-0 left-0 mr-2" />
            <CarouselNext className="relative static translate-y-0 right-0 ml-2" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
