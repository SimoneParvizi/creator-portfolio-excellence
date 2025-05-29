
import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clock, CheckCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const timeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

const consultationTypes = [
  { id: "mlops", title: "MLOps Consultation" },
  { id: "devops", title: "DevOps Consultation" },
  { id: "coaching", title: "Career Coaching" }
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

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleContinue = () => {
    if (date && selectedTimeSlot && selectedType) {
      setShowForm(true);
    } else {
      toast({
        title: "Please select all options",
        description: "Choose a date, time, and consultation type",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: z.infer<typeof bookingSchema>) => {
    console.log("Booking submitted:", { date, timeSlot: selectedTimeSlot, consultationType: selectedType, ...data });
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
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Book a Session</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Schedule a consultation to discuss your MLOps and DevOps needs
          </p>
          <p className="text-primary font-medium bg-primary/10 py-2 px-4 rounded-md inline-block">
            First 30 minutes are free
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => 
                  date < new Date() || 
                  date.getDay() === 0 || 
                  date.getDay() === 6
                }
              />
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTimeSlot === time ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTimeSlot(time)}
                    disabled={!date}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consultation Type */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {consultationTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedType(type.id)}
                  >
                    {type.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={handleContinue}
            disabled={!date || !selectedTimeSlot || !selectedType}
          >
            Continue Booking
          </Button>
        </div>
      </div>

      {/* Booking Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
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
                        placeholder="What would you like to discuss?" 
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
                <Button type="submit">
                  Book Session
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl mb-2">Booking Confirmed!</DialogTitle>
            <p className="text-muted-foreground mb-4">
              {date && format(date, "MMMM d, yyyy")} at {selectedTimeSlot}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Confirmation sent to your email.
            </p>
            <Button onClick={resetBooking}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Booking;
