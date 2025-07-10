
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
  { id: "website", title: "Website Design" },
  { id: "mlops", title: "MLOps Consultation" },
  { id: "devops", title: "DevOps Consultation" },
  { id: "else", title: "Else" }
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

  const handleTimeSlotClick = (time: string) => {
    if (selectedTimeSlot === time) {
      setSelectedTimeSlot(null);
    } else {
      setSelectedTimeSlot(time);
    }
  };

  const handleTypeClick = (typeId: string) => {
    if (selectedType === typeId) {
      setSelectedType(null);
    } else {
      setSelectedType(typeId);
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
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Date Selection */}
          <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
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
          <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
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

          {/* Consultation Type */}
          <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
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
                    onClick={() => handleTypeClick(type.id)}
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
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Complete Your Booking</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your name" 
                        {...field} 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
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
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@example.com" 
                        {...field} 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
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
                    <FormLabel className="text-gray-700">Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What would you like to discuss?" 
                        {...field} 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
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
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl">
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl mb-2 text-gray-900">Booking Confirmed!</DialogTitle>
            <p className="text-gray-600 mb-4">
              {date && format(date, "MMMM d, yyyy")} at {selectedTimeSlot}
            </p>
            <p className="text-sm text-gray-500 mb-6">
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
