
import React, { useState, useRef, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clock, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const consultationTypes = [
  { id: "mlops", title: "MLOps Consultation", description: "Get advice on MLOps implementation and best practices" },
  { id: "devops", title: "DevOps Consultation", description: "Optimize your CI/CD pipelines and infrastructure" },
  { id: "coaching", title: "Career Coaching", description: "Guidance for advancing your career in ML engineering" }
];

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().optional(),
});

const Booking = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(selectedTimeSlot === time ? null : time);
  };

  const handleTypeClick = (typeId: string) => {
    setSelectedType(selectedType === typeId ? null : typeId);
  };

  const getButtonText = () => {
    if (!date || !selectedTimeSlot || !selectedType) {
      return "Continue Booking";
    }
    return "Let's do it";
  };

  const handleContinue = () => {
    if (date && selectedTimeSlot && selectedType) {
      setShowForm(true);
    } else {
      toast({
        title: "Incomplete selection",
        description: "Please select a date, time slot, and consultation type",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: z.infer<typeof bookingSchema>) => {
    console.log("Booking submitted:", {
      date,
      timeSlot: selectedTimeSlot,
      consultationType: selectedType,
      ...data,
    });
    
    setShowForm(false);
    setShowConfirmation(true);
  };

  const resetBooking = () => {
    setDate(undefined);
    setSelectedTimeSlot(null);
    setSelectedType(null);
    setShowConfirmation(false);
    form.reset();
  };

  return (
    <section id="booking" ref={sectionRef} className="py-24 bg-gradient-to-b from-background via-secondary/10 to-background relative z-10">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">Book My Time</h2>
          <p className="section-subtitle slide-up">
            Schedule a consultation or coaching session to discuss your MLOps challenges,
            get personalized advice, or learn more about implementing DevOps practices.
          </p>
          <p className="text-lg text-primary-foreground font-medium mt-4 slide-up bg-primary/80 py-2 px-4 rounded-md inline-block shadow-sm">
            The first 30-minute consultation is free of charge
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8 flex flex-col slide-up">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Select a Date</CardTitle>
                <CardDescription>Choose an available date for your session</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="pointer-events-auto rounded-md border calendar-fancy-hover"
                  disabled={(date) => 
                    date < new Date() || // No past dates
                    date.getDay() === 0 || // No Sundays
                    date.getDay() === 6    // No Saturdays
                  }
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 flex flex-col slide-up">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Select a Time</CardTitle>
                <CardDescription>Available time slots for {date ? format(date, "EEEE, MMMM d, yyyy") : "your selected date"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTimeSlot === time ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleTimeSlotClick(time)}
                      disabled={!date}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Consultation Type</CardTitle>
                <CardDescription>Choose the type of session you need</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultationTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleTypeClick(type.id)}
                    >
                      <div>
                        <div className="font-medium">{type.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleContinue}
              disabled={!date || !selectedTimeSlot || !selectedType}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md bg-white border-none">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              {selectedType && consultationTypes.find(t => t.id === selectedType)?.title} on{" "}
              {date && format(date, "MMMM d, yyyy")} at {selectedTimeSlot}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Let me know what you'd like to discuss" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="text-white">
                  Book Session
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-white border-none">
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl mb-2">Booking Confirmed!</DialogTitle>
            <DialogDescription className="mb-6">
              {selectedType && consultationTypes.find(t => t.id === selectedType)?.title}<br />
              {date && format(date, "MMMM d, yyyy")} at {selectedTimeSlot}
            </DialogDescription>
            <p className="text-sm text-muted-foreground mb-6">
              A confirmation has been sent to your email. I'll contact you soon with further details.
            </p>
            <Button onClick={resetBooking}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <style jsx global>{`
        .calendar-fancy-hover .rdp-day:not(.rdp-day_disabled):hover {
          color: #ea384c !important;
          transition: color 0.3s ease;
        }
        
        .calendar-fancy-hover .rdp-button:hover:not([disabled]) {
          color: #ea384c !important;
          transition: color 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default Booking;
