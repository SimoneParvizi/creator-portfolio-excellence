import React, { useRef, useEffect, useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

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
          <h2 ref={titleRef} className="section-title slide-up">Let's start working together</h2>
          <p className="section-subtitle slide-up mb-6 font-lora">
            Got a concept or partnership in mind? Let's have a conversation about it.
          </p>
          <p className="section-subtitle slide-up font-lora">
            I believe in honest work for honest pay. My goal is to build systems that make you happy to pay for them, because they work, and they're built with care. I'm not here to overcharge or underdeliver. My process is open and practical, committed to your success. You get clear communication and a partner who values your trust and your time.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
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
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring placeholder:text-foreground/40"
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring placeholder:text-foreground/40"
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="block w-full rounded-md bg-gray-50/60 border-input backdrop-blur-sm shadow-sm focus:border-ring resize-none placeholder:text-foreground/40"
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
