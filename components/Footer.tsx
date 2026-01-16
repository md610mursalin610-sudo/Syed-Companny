import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Facebook, Hexagon } from 'lucide-react';

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ElementType;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Explore',
    links: [
      { title: 'Work', href: '#work' },
      { title: 'Services', href: '#services' },
      { title: 'Process', href: '#process' },
      { title: 'Studio', href: '#about' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { title: 'Start a Project', href: '#contact' },
      { title: 'hello@aura.studio', href: 'mailto:hello@aura.studio' },
      { title: 'Careers', href: '#' },
    ],
  },
  {
    label: 'Social',
    links: [
      { title: 'Instagram', href: '#', icon: Instagram },
      { title: 'Twitter', href: '#', icon: Twitter },
      { title: 'LinkedIn', href: '#', icon: Linkedin },
      { title: 'Facebook', href: '#', icon: Facebook },
    ],
  },
  {
    label: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '#' },
      { title: 'Terms of Service', href: '#' },
      { title: 'Cookie Policy', href: '#' },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center border-t border-white/5 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.05),transparent)] px-6 py-20 lg:py-24 mt-20">
      {/* Top Blurred Line */}
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[1px]" />

      <div className="grid w-full gap-12 xl:grid-cols-3 xl:gap-8">
        {/* Brand Section */}
        <AnimatedContainer className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter text-white">
              AURA<span className="text-indigo-500">.</span>
            </span>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
            Crafting premium digital experiences for the next generation of industry leaders.
            <br />
            Based in San Francisco, working globally.
          </p>
          <p className="text-neutral-600 text-sm pt-4">
            © {new Date().getFullYear()} Aura Studio. All rights reserved.
          </p>
        </AnimatedContainer>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  {section.label}
                </h3>
                <ul className="space-y-3 text-sm text-neutral-400">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="hover:text-indigo-400 inline-flex items-center gap-2 transition-colors duration-200"
                      >
                        {link.icon && <link.icon className="size-4 opacity-70" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
};

interface AnimatedContainerProps {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

function AnimatedContainer({ className, delay = 0.1, children }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', y: 10, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
