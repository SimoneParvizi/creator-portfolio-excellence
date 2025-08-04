import React, { useRef, useEffect, useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import FloatingSpheres from '../ui/FloatingSpheres';

// Global state for form field focus - dots can access this
declare global {
  interface Window {
    activeFormField: {
      id: string | null;
      rect: DOMRect | null;
    };
  }
}

const Contact: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize global state
  useEffect(() => {
    if (!window.activeFormField) {
      window.activeFormField = {
        id: null,
        rect: null
      };
    }
  }, []);

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

  const handleFieldFocus = (fieldId: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    window.activeFormField = {
      id: fieldId,
      rect: rect
    };
  };

  const handleFieldBlur = () => {
    window.activeFormField = {
      id: null,
      rect: null
    };
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
          <h2 ref={titleRef} className="section-title slide-up">Let's start working together</h2>
          <p className="section-subtitle slide-up mb-6 font-lora">
            Got a concept or partnership in mind?<br />Let's have a conversation about it
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Floating Spheres - Desktop Side Companion */}
          <div className="absolute -right-32 lg:-right-48 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
            <div className="w-64 h-80">
              <FloatingSpheres className="absolute inset-0" />
            </div>
          </div>

          {/* Centered Contact Form */}
          <div className="max-w-xl mx-auto">
            <div className="slide-up">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-green-500/30 bg-green-500/5">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground font-sans">
                    Thank you for reaching out. Talk to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      ref={nameRef}
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formState.name}
                      onChange={handleChange}
                      onFocus={(e) => handleFieldFocus('name', e.target)}
                      onBlur={handleFieldBlur}
                      required
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring placeholder:text-foreground/40 transition-all duration-300 font-lora text-center"
                    />
                  </div>
                  
                  <div>
                    <Input
                      ref={emailRef}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formState.email}
                      onChange={handleChange}
                      onFocus={(e) => handleFieldFocus('email', e.target)}
                      onBlur={handleFieldBlur}
                      required
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring placeholder:text-foreground/40 transition-all duration-300 font-lora text-center"
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      ref={messageRef}
                      id="message"
                      name="message"
                      placeholder="Message"
                      value={formState.message}
                      onChange={handleChange}
                      onFocus={(e) => handleFieldFocus('message', e.target)}
                      onBlur={handleFieldBlur}
                      required
                      rows={5}
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring resize-none placeholder:text-foreground/40 transition-all duration-300 font-lora text-center"
                    />
                  </div>
                  
                  <div className="relative flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-white shadow transition-colors hover:bg-foreground/80 disabled:opacity-70 disabled:cursor-not-allowed font-lora"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>send message</span>
                          <Send size={16} className="ml-2" />
                        </div>
                      )}
                    </button>
                    
                    {/* Mobile Floating Spheres - Directly below button */}
                    <div className="xl:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none">
                      <div className="w-48 h-32">
                        <FloatingSpheres className="absolute inset-0" />
                      </div>
                    </div>
                  </div>
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
