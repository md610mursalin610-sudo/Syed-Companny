import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Smartphone, Search, Layers, Command, Zap } from 'lucide-react';
import { FeaturesSectionWithHoverEffects } from './ui/feature-section';

const services = [
  {
    title: 'UI/UX Design',
    description: 'Crafting intuitive and visually stunning interfaces that users love.',
    icon: <Layout size={24} />,
  },
  {
    title: 'Product Design',
    description: 'End-to-end product thinking from MVP to scalable systems.',
    icon: <Command size={24} />,
  },
  {
    title: 'Mobile App Design',
    description: 'Native iOS and Android experiences optimized for touch.',
    icon: <Smartphone size={24} />,
  },
  {
    title: 'Design Systems',
    description: 'Scalable component libraries that ensure consistency.',
    icon: <Layers size={24} />,
  },
  {
    title: 'UX Research',
    description: 'Data-driven insights to validate assumptions and guide decisions.',
    icon: <Search size={24} />,
  },
  {
    title: 'Brand Interface',
    description: 'Translating brand identity into digital interaction patterns.',
    icon: <Zap size={24} />,
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-neutral-950 relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:w-2/3"
        >
          <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">
            Our Expertise
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            We don't just design screens. <br />
            We engineer <span className="text-neutral-500">experiences.</span>
          </h3>
        </motion.div>

        <FeaturesSectionWithHoverEffects features={services} />
      </div>
    </section>
  );
};