import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 bg-background relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">
              Get in Touch
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Ready to start your project?
            </h3>
            <p className="text-neutral-400 text-lg">
              We are currently accepting new projects for Q3 2024.
            </p>
          </motion.div>

          {formState === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900/50 border border-indigo-500/30 rounded-3xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-white" size={32} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Message Sent</h4>
              <p className="text-neutral-400">We'll get back to you within 24 hours.</p>
              <button 
                onClick={() => setFormState('idle')}
                className="mt-8 text-sm text-indigo-400 hover:text-white transition-colors"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-neutral-400 ml-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-neutral-400 ml-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm text-neutral-400 ml-1">Project Type</label>
                <select
                  id="type"
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option>UI/UX Design</option>
                  <option>Product Design</option>
                  <option>Design System</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-neutral-400 ml-1">Project Details</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Tell us about your project goals..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full bg-white text-black font-bold text-lg rounded-xl py-4 hover:bg-neutral-200 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {formState === 'submitting' ? 'Sending...' : 'Send Request'}
                {!formState && <ArrowRight size={20} />}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
};