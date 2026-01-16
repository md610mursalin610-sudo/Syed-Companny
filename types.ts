import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  year: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface Tool {
  name: string;
  category: string;
}