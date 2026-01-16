import React from 'react';

const tools = ['Figma', 'Framer', 'React', 'TypeScript', 'Webflow', 'Tailwind'];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-12">
          <div>
            <h2 className="text-8xl md:text-9xl font-bold text-white/5 tracking-tighter -ml-4">
              AURA
            </h2>
            <p className="text-neutral-400 mt-4 max-w-sm">
              Crafting premium digital experiences for the next generation of industry leaders.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 max-w-md justify-start md:justify-end">
             {tools.map(tool => (
                 <span key={tool} className="px-4 py-2 rounded-full border border-white/10 text-neutral-500 text-sm">
                     {tool}
                 </span>
             ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-neutral-600">
          <p>&copy; {new Date().getFullYear()} Aura Studio. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};