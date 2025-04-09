
import React, { useRef, useEffect, useState } from 'react';
import { Send, CheckCircle, Linkedin, Github, Twitter } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const Contact: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      
      // Reset submission status after a delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 ref={titleRef} className="section-title slide-up">Get In Touch</h2>
          <p className="section-subtitle slide-up">
            Have a project in mind or want to discuss potential opportunities? 
            I'd love to hear from you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="slide-up flex flex-col justify-center">
              <div className="space-y-6">                
                <a href="mailto:parvizi.simone@gmail.com" className="text-foreground/80 hover:text-foreground transition-colors block">
                  parvizi.simone@gmail.com
                </a>
                
                <div className="text-foreground/80">San Francisco, CA</div>
                
                <div className="pt-4 flex space-x-4">
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-[#0077B5] text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-[#333333] text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-[#1DA1F2] text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="slide-up">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-green-500/30 bg-green-500/5">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground font-sans">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-white shadow transition-colors hover:bg-foreground/80 disabled:opacity-70 disabled:cursor-not-allowed w-full"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Send Message</span>
                        <Send size={16} className="ml-2" />
                      </div>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
