import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(#404040 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
        }}></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
             <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">
              The Studio
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
              Built for founders who value <span className="text-indigo-400">craft.</span>
            </h3>
            <div className="space-y-6 text-lg text-neutral-400">
              <p>
                Aura is a founder-led digital design studio. We don't act as a distant vendor, but as a core partner in your product's journey.
              </p>
              <p>
                In a world of noise, clarity is power. We strip away the non-essential to reveal the core value of your product, wrapping it in an aesthetic that inspires trust and delight.
              </p>
            </div>
            
            <div className="mt-12 flex gap-8">
                <div>
                    <span className="block text-3xl font-bold text-white">40+</span>
                    <span className="text-sm text-neutral-500 uppercase tracking-wide">Projects Shipped</span>
                </div>
                <div>
                    <span className="block text-3xl font-bold text-white">5y</span>
                    <span className="text-sm text-neutral-500 uppercase tracking-wide">Experience</span>
                </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
             <div className="relative aspect-square rounded-full overflow-hidden border border-white/5">
                <img 
                    src="https://picsum.photos/800/800?grayscale" 
                    alt="Studio Abstract" 
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
             </div>
             
             {/* Floating Badge */}
             <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-xs"
             >
                <p className="text-white font-medium">"Aura transformed our MVP into a product that investors loved."</p>
                <p className="text-indigo-400 text-sm mt-2">- Sarah J., CEO @ TechFlow</p>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};