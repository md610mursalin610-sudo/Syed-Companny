import React from 'react';
import { motion } from 'framer-motion';
import { ProcessStep } from '../types';

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description: 'We dive deep into your business goals, user needs, and market landscape to build a solid foundation.',
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'We define the user journey, information architecture, and core features before drawing a single pixel.',
  },
  {
    number: '03',
    title: 'Craft',
    description: 'We bring the vision to life with high-fidelity visuals, interactive prototypes, and motion design.',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'We support development handover and QA to ensure the final product matches the design perfectly.',
  },
];

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-32 bg-neutral-950">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 md:w-1/2"
        >
          <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">
            How We Work
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            A proven process for scaleable results.
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative pt-12"
            >
              {/* Dot on line */}
              <div className="hidden md:block absolute top-[43px] left-0 w-3 h-3 bg-neutral-950 border-2 border-indigo-500 rounded-full z-10" />
              
              <span className="block text-6xl font-bold text-white/5 mb-6">
                {step.number}
              </span>
              <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};