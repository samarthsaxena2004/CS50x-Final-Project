// src/components/SectionComponents.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// --- TYPES ---
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string; // URL to image
  techStack: string[];
  liveLink?: string;
  repoLink?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyLogo?: string; // URL to logo
  period: string;
  description: string; // The expanded text
}

export interface OpenSource {
  id: string;
  project: string; // "Consul Democracy"
  title: string;   // "SAML and OIDC..."
  description: string;
  logo?: string;
  techStack: string[];
  period: string;
  link?: string;   // "Contributions" or "Analysis" link
  linkText?: string; // Button text e.g. "Analysis"
}

// --- 1. PROJECT CARD (Screenshot 2 style) ---
export const ProjectCard = ({ data }: { data: Project }) => {
  return (
    <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      {/* Thumbnail */}
      <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        {data.thumbnail ? (
          <Image 
            src={data.thumbnail} 
            alt={data.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{data.title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-4 flex-grow">
          {data.description}
        </p>
        
        {/* Buttons */}
        <div className="flex gap-3 mt-auto">
          {data.liveLink && (
            <a href={data.liveLink} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition">
              <ExternalLink className="w-4 h-4" /> Live
            </a>
          )}
          {data.repoLink && (
            <a href={data.repoLink} target="_blank" className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
              <Github className="w-4 h-4" /> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 2. WORK EXPERIENCE ACCORDION (Screenshot 1 style) ---
export const ExperienceItem = ({ data }: { data: Experience }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col md:flex-row md:items-center justify-between py-6 cursor-pointer group"
      >
        <div className="flex-1 font-medium text-lg text-neutral-900 dark:text-white mb-2 md:mb-0">
          {data.role}
        </div>
        
        <div className="flex-1 flex items-center gap-3 mb-2 md:mb-0">
          {data.companyLogo && (
             <div className="relative w-6 h-6 rounded overflow-hidden">
                <Image src={data.companyLogo} alt={data.company} fill className="object-contain" />
             </div>
          )}
          <span className="text-neutral-600 dark:text-neutral-300 font-medium">{data.company}</span>
        </div>

        <div className="flex-1 flex items-center justify-between md:justify-end gap-4 text-neutral-500 text-sm">
          <span>{data.period}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {data.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 3. OPEN SOURCE CARD (Screenshot 1 style) ---
export const OpenSourceCard = ({ data }: { data: OpenSource }) => {
  return (
    <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col h-full hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
      <div className="flex items-center gap-4 mb-4">
        {data.logo && (
            <div className="relative w-12 h-12">
                 <Image src={data.logo} alt={data.project} fill className="object-contain" />
            </div>
        )}
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{data.project}</h3>
      </div>
      
      <div className="mb-4">
          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">{data.title}</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">{data.description}</p>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between">
         <div className="flex flex-wrap gap-2">
            {data.techStack?.map((tech, i) => (
                <span key={i} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] uppercase font-bold text-neutral-600 dark:text-neutral-400 rounded">
                    {tech}
                </span>
            ))}
         </div>
         {data.link && (
             <a href={data.link} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-full text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
                 {data.linkText || "View"} <ExternalLink className="w-3 h-3" />
             </a>
         )}
      </div>
    </div>
  );
};
