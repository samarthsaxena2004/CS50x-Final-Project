"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Newsreader } from "next/font/google";

// Initialize Serif Font
const newsreader = Newsreader({ 
  subsets: ["latin"], 
  style: ["normal", "italic"], 
  weight: ["400", "500", "600", "700"] 
});

// --- HIGHLIGHT COMPONENTS & PROCESSORS ---

const AVAILABLE_COLORS = ["blue", "green", "orange", "cyan", "yellow"];

const Highlight = ({ children, color = "blue" }: { children: React.ReactNode, color?: "blue" | "green" | "orange" | "cyan" | "yellow" }) => {
    const colors = {
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
        green: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
        orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
        cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200",
        yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    };
    const highlightTextColor = color === 'yellow' || color === 'orange' ? 'text-zinc-900/70' : '';
    
    return ( 
        <span className={`${colors[color]} px-1.5 py-0.5 rounded-md mx-1 font-medium inline-block transform -rotate-1 ${highlightTextColor}`}>
            {children}
        </span>
    );
};

const processBioText = (text: string) => {
  if (!text) return null;

  const keywords = [
    "scalable web apps",
    "swimming laps",
    "curating my next playlist",
    "shipping code",
    "complex problems",
    "road trips"
  ];

  let result = text;
  let usedColors: string[] = [];

  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi'); 
    
    if (result.match(regex)) {
        let color: string;
        do {
            color = AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];
        } while (usedColors.includes(color));

        usedColors.push(color);
        if (usedColors.length > 3) usedColors.shift(); 

        const replacement = `<HIGHLIGHT color="${color}">${keyword}</HIGHLIGHT>`;
        result = result.replace(regex, replacement);
    }
  });

  const parts = result.split(/(<HIGHLIGHT[^>]*>.*?<\/HIGHLIGHT>)/g).filter(p => p.length > 0);
  
  return parts.map((part, index) => {
    if (part.startsWith('<HIGHLIGHT')) {
      const match = part.match(/<HIGHLIGHT.*?color="(.*?)">(.*?)<\/HIGHLIGHT>/i);
      if (match && match.length === 3) {
        const [, color, content] = match;
        return <Highlight key={index} color={color as any}>{content}</Highlight>;
      }
    }
    return part;
  });
};

// --- ABOUT ITEM COMPONENT ---
const AboutItem = ({ data }: any) => (
  <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800 last:border-0 py-6">
    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center text-xl shrink-0">
        {data.iconType === 'image' ? <img src={data.iconDark} alt="icon" className="w-full h-full object-cover rounded-lg"/> : (data.emoji || "📌")}
    </div>
    <div className="flex-1">
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{data.title}</h3>
            <span className="text-xs font-mono text-neutral-500">{data.date}</span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{data.subtitle}</p>
        {data.description && <p className="text-sm text-neutral-500 mt-2 leading-relaxed whitespace-pre-wrap">{data.description}</p>}
    </div>
  </div>
);

export default function AboutPage() {
  const [pageInfo, setPageInfo] = useState<any>({});
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New state to hold the client-processed text
  const [processedBio, setProcessedBio] = useState<React.ReactNode>(null); 

  const staticBio = "I love to build scalable web apps. When I'm not shipping code, I'm usually swimming laps or curating my next playlist. I also love random road trips!";

  useEffect(() => {
    async function fetchData() {
      try {
        const infoSnap = await getDoc(doc(db, "content", "about"));
        if(infoSnap.exists()) setPageInfo(infoSnap.data());

        const secSnap = await getDocs(query(collection(db, "about_sections"), orderBy("order", "asc")));
        setSections(secSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    
    // FIX: Run non-deterministic rendering logic ONLY on the client after mount
    setProcessedBio(processBioText(staticBio));
    
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20 space-y-20">
        
        {/* --- HEADER (Consistent with Work/Blog Page Style) --- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-900 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                {pageInfo.iconType === 'image' ? <img src={pageInfo.iconDark} className="w-full h-full object-cover"/> : (pageInfo.emoji || "👋")}
             </div>
             <h1 className={`text-4xl md:text-5xl font-medium tracking-tight ${newsreader.className}`}>{pageInfo.pageTitle || "About Me"}</h1>
          </div>
          
          {/* BIO TEXT - Renders only after client-side processing is complete */}
          <div className={`text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-300 ml-1 ${newsreader.className} max-w-3xl italic`}>
             {processedBio || "Loading bio..." /* Display loading placeholder during initial SSR */}
          </div>
        </div>

        {/* --- DYNAMIC SECTIONS --- */}
        {loading ? (
            <div className="space-y-8">
                <div className="h-8 w-32 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded"></div>
                <div className="h-24 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-xl"></div>
            </div>
        ) : (
            sections.map(section => (
                <section key={section.id} className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                        <span className="text-2xl">{section.iconType === 'image' ? <img src={section.iconDark} className="w-8 h-8 rounded"/> : section.emoji}</span>
                        <h2 className={`text-2xl font-bold ${newsreader.className}`}>{section.title}</h2>
                    </div>
                    
                    <div className="flex flex-col">
                        {section.items?.map((item: any) => (
                            <AboutItem key={item.id} data={item} />
                        ))}
                    </div>
                </section>
            ))
        )}

      </main>
    </div>
  );
}
