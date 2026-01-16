import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

const projects: Project[] = [
  {
    id: 1,
    title: 'FinEdge',
    category: 'Fintech SaaS Dashboard',
    image: 'https://picsum.photos/800/600?random=1',
    year: '2023',
  },
  {
    id: 2,
    title: 'Aero',
    category: 'Travel Booking App',
    image: 'https://picsum.photos/800/600?random=2',
    year: '2023',
  },
  {
    id: 3,
    title: 'Nexus',
    category: 'Design System Documentation',
    image: 'https://picsum.photos/800/600?random=3',
    year: '2024',
  },
  {
    id: 4,
    title: 'Lumina',
    category: 'Smart Home Interface',
    image: 'https://picsum.photos/800/600?random=4',
    year: '2024',
  },
];

export const Work: React.FC = () => {
  return (
    <section id="work" className="py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">
              Selected Works
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Recent Case Studies
            </h3>
          </motion.div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            href="#"
            className="hidden md:flex items-center gap-2 text-white hover:text-indigo-400 transition-colors mt-4 md:mt-0"
          >
            View all projects <ArrowUpRight size={18} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`group cursor-pointer ${index % 2 !== 0 ? 'md:translate-y-24' : ''}`}
            >
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] mb-8 bg-neutral-900">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="flex items-start justify-between border-b border-white/10 pb-6 group-hover:border-indigo-500/50 transition-colors">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{project.title}</h4>
                  <p className="text-neutral-400">{project.category}</p>
                </div>
                <span className="px-3 py-1 rounded-full border border-white/10 text-xs text-neutral-400">
                  {project.year}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center md:hidden">
            <a
            href="#"
            className="inline-flex items-center gap-2 text-white hover:text-indigo-400 transition-colors"
          >
            View all projects <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};