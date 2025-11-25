"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, FileText, Github, Twitter, Linkedin, ArrowUpRight, Clock, Loader2, CheckCircle2, Instagram, Calendar } from "lucide-react";
import Image from "next/image"; 
import { Navbar } from "../components/Navbar"; 
import { TimeAlive } from "../components/TimeAlive";
import { CurrentTime } from "../components/CurrentTime"; 
import { SiJavascript, SiTypescript, SiNextdotjs, SiReact, SiTailwindcss, SiPrisma, SiNodedotjs, SiFirebase, SiSupabase, SiFigma, SiNginx, SiLinux, SiMui, SiCss3, SiExpress, SiAndroid, SiShadcnui, SiLeetcode, SiCodeforces } from "react-icons/si";
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTheme } from "next-themes";
import { getCalApi } from "@calcom/embed-react";

// 1. IMPORT THE SERIF FONT
import { Newsreader } from "next/font/google";
const newsreader = Newsreader({ 
  subsets: ["latin"], 
  style: ["normal", "italic"], // Import italics for that elegant look
  weight: ["400", "500", "600", "700"] // Import weights
});

// 2. HIGHLIGHT COMPONENT (Matches your screenshot)
const Highlight = ({ children, color = "blue" }: { children: React.ReactNode, color?: "blue" | "green" | "orange" | "cyan" | "yellow" }) => {
    const colors = {
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
        green: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
        orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
        cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200",
        yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    };

    return (
        <span className={`${colors[color]} px-1.5 py-0.5 rounded-md mx-1 font-medium inline-block transform -rotate-1`}>
            {children}
        </span>
    );
};

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const [bentoItems, setBentoItems] = useState<any[]>([]);
  const { resolvedTheme } = useTheme();

  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => { 
    setMounted(true); 
    getDoc(doc(db, "content", "profile")).then(s => { if (s.exists()) setProfile(s.data()); });
    getDocs(query(collection(db, "home_bento"), orderBy("order", "asc"))).then(s => setBentoItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    if (window.location.hash === "#reach") {
        setTimeout(() => {
            document.getElementById("reach")?.scrollIntoView({ behavior: "smooth" });
        }, 500);
    }

    (async function () {
      const cal = await getCalApi({});
      cal("ui", { styles: { branding: { brandColor: "#000000" } }, hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) { setStatus("success"); return; }
    setStatus("loading");
    try { await addDoc(collection(db, "portfolio_messages"), { name, email, message, createdAt: serverTimestamp() }); setStatus("success"); setName(""); setEmail(""); setMessage(""); setTimeout(() => setStatus("idle"), 3000); } catch { setStatus("error"); }
  };

  if(!mounted) return null;

  return (
    <div className="relative bg-neutral-50 dark:bg-[#050505] min-h-screen spotlight transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <motion.main variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl mx-auto px-6 pt-32 pb-12 md:pt-32 md:pb-32 space-y-12 md:space-y-16">
        
        {/* HERO SECTION - Updated with Serif Font & Highlights */}
        <motion.section variants={itemVariants} className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-10">
          <div className="flex-1 space-y-4 text-center md:text-left">
            
            {/* Name & Title */}
            <div className="space-y-1">
                <h1 className={`text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-white ${newsreader.className}`}>
                    {profile.name || "Samarth Saxena"} 
                </h1>
                {/* Example of how to use the Highlight component manually if you want to override the database */}
                <p className={`text-xl md:text-2xl leading-relaxed text-neutral-600 dark:text-neutral-300 ${newsreader.className} italic`}>
                    a <Highlight color="blue">full stack developer</Highlight> crafting things that are <span className="font-bold not-italic">scalable ☀️</span> and <span className="font-bold not-italic">smooth ✿</span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-normal text-lg font-sans">• <TimeAlive /></span>
                </p>
                
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-xs font-medium pt-2">
              <div className="flex items-center gap-1.5 bg-neutral-200/50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-md text-neutral-700 dark:text-neutral-300"><MapPin className="w-3 h-3 text-red-500" /> <span>{profile.location || "India"}</span></div>
              <div className="flex items-center gap-1.5 bg-neutral-200/50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-md text-neutral-700 dark:text-neutral-300 min-w-[90px]"><Clock className="w-3 h-3 text-neutral-500" /> <CurrentTime /></div>
              {profile.resume && <a href={profile.resume} target="_blank" className="flex items-center gap-1.5 bg-neutral-200/50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-[#222] transition"><FileText className="w-3 h-3 text-yellow-500" /> <span>Resume</span></a>}
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-neutral-200 dark:bg-[#222] rounded-full rotate-6 group-hover:rotate-3 transition duration-300"></div>
              <div className="relative h-36 w-36 md:h-48 md:w-48 bg-neutral-100 dark:bg-[#111] rounded-full overflow-hidden rotate-3 group-hover:rotate-0 transition duration-300 border border-neutral-200 dark:border-neutral-800">
                  <Image src="/me.jpg" alt="Profile" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
          </div>
        </motion.section>

        {/* ABOUT - Uses the serif font for the header */}
        <motion.section id="about" variants={itemVariants} className="space-y-4">
          <h2 className={`text-2xl font-bold flex items-center gap-2 text-neutral-900 dark:text-white ${newsreader.className}`}>
            About <span className="text-neutral-400 font-normal text-lg font-sans">• 約</span>
          </h2>
          <div className="prose prose-neutral dark:prose-invert text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm text-justify hyphens-auto whitespace-pre-wrap font-sans">
              {profile.bio}
          </div>
        </motion.section>

        {/* SKILLS */}
        <motion.section variants={itemVariants} className="space-y-3 mask-gradient">
          <div className="overflow-hidden flex"><div className="flex w-[200%] animate-scroll gap-3">{[...row1, ...row1].map((tech, i) => <SkillPill key={i} {...tech} />)}</div></div>
          <div className="overflow-hidden flex"><div className="flex w-[200%] animate-scroll-reverse gap-3">{[...row2, ...row2].map((tech, i) => <SkillPill key={i} {...tech} />)}</div></div>
          <div className="overflow-hidden flex"><div className="flex w-[200%] animate-scroll gap-3">{[...row3, ...row3].map((tech, i) => <SkillPill key={i} {...tech} />)}</div></div>
        </motion.section>

        {/* BENTO GRID */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[140px]">
            {bentoItems.map((item) => {
                const span = item.span === "2" ? "md:col-span-2" : "";
                
                if (item.type === 'github') return (
                    <a key={item.id} href={item.link} target="_blank" className={`${span} relative bg-[#111] border border-neutral-800 rounded-xl p-6 flex flex-col justify-between overflow-hidden group hover:border-neutral-600 transition min-h-[140px]`}>
                        <div className="z-10"><div className="flex items-center gap-2 text-white font-semibold"><Github className="w-5 h-5" /><span>{item.title}</span></div><p className="text-xs text-neutral-400 mt-1">{item.subtitle}</p></div>
                        <div className="z-10 flex gap-4 text-xs font-mono text-neutral-400"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Stars: 3</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> PRs: 5</span></div>
                        <Github className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4 w-32 h-32 rotate-12" />
                    </a>
                );

                if (item.type === 'stats') return (<div key={item.id} className={`${span} bg-[#111] border border-neutral-800 rounded-xl p-5 flex flex-col justify-end items-center relative overflow-hidden min-h-[140px]`}><div className="absolute inset-0 p-4 opacity-30 grid grid-cols-6 gap-1">{Array.from({ length: 30 }).map((_, i) => <div key={i} className={`rounded-sm ${Math.random() > 0.6 ? 'bg-green-500' : 'bg-neutral-800'} h-full w-full`}></div>)}</div><div className="z-10 text-center bg-[#111]/80 backdrop-blur-sm p-2 rounded-lg w-full"><p className="text-xl font-bold text-white">53h</p><p className="text-[10px] text-neutral-400 uppercase">Coding Stats</p></div></div>);
                if (item.type === 'leetcode') return (<a key={item.id} href={item.link} target="_blank" className={`${span} relative bg-[#ffa116]/10 border border-[#ffa116]/20 rounded-xl p-6 flex flex-col justify-between overflow-hidden group hover:bg-[#ffa116]/20 transition min-h-[140px]`}><div className="z-10"><div className="flex items-center gap-2 text-[#ffa116] font-semibold"><SiLeetcode className="w-5 h-5" /><span>{item.title}</span></div><p className="text-xs text-yellow-600 mt-1">{item.subtitle}</p></div></a>);
                if (item.type === 'codeforces') return (<a key={item.id} href={item.link} target="_blank" className={`${span} relative bg-blue-900/20 border border-blue-800/30 rounded-xl p-6 flex flex-col justify-between overflow-hidden group hover:bg-blue-900/30 transition min-h-[140px]`}><div className="z-10"><div className="flex items-center gap-2 text-blue-400 font-semibold"><SiCodeforces className="w-5 h-5" /><span>{item.title}</span></div><p className="text-xs text-blue-300 mt-1">{item.subtitle}</p></div></a>);
                if (item.type === 'image') return (<div key={item.id} className={`${span} bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between text-white relative overflow-hidden min-h-[140px]`}><div className="flex justify-between items-start z-10"><span className="text-2xl">📸</span><ArrowUpRight className="w-4 h-4 opacity-50" /></div><div className="z-10"><p className="font-semibold">{item.title}</p><p className="text-xs text-neutral-500">{item.subtitle}</p></div></div>);

                let bgColor = item.color || "bg-neutral-900";
                if (item.type === 'linkedin') bgColor = 'bg-[#0077b5]';
                if (item.type === 'instagram') bgColor = 'bg-pink-600';
                if (item.type === 'twitter') bgColor = 'bg-black border border-neutral-800';

                return (
                    <a key={item.id} href={item.link} target="_blank" className={`${span} ${bgColor} rounded-xl p-5 flex flex-col justify-between text-white hover:opacity-90 transition min-h-[140px]`}>
                        <div className="flex justify-between items-start"><span className="text-2xl"><DynamicIcon {...item} theme={resolvedTheme} /></span><ArrowUpRight className="w-4 h-4" /></div>
                        <div><p className="text-xs opacity-80 mb-1">{item.subtitle}</p><p className="font-semibold">{item.title}</p></div>
                    </a>
                );
            })}
        </motion.section>

        {/* CONTACT FORM */}
        <div id="reach" className="scroll-mt-32">
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="bg-neutral-100 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 text-center space-y-4">
              <h2 className={`text-2xl font-bold text-neutral-900 dark:text-white ${newsreader.className}`}>Let's Talk!</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-md mx-auto">Got something to say? Drop your message below.</p>
              
              <div className="max-w-sm mx-auto space-y-3 pt-4">
                <button 
                  data-cal-link="samarthsaxena" 
                  data-cal-config='{"layout":"month_view"}'
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-medium py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition text-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Schedule a call
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-neutral-400">OR</span>
                    <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-left relative">
                    <div className="hidden opacity-0 absolute -z-10"><input type="text" name="company_field_do_not_fill" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off"/></div>
                    <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-500 transition" required />
                    <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-500 transition" required />
                    <textarea rows={3} placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-500 transition resize-none" required />
                    <button disabled={status === "loading"} className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-medium py-3 rounded-lg hover:opacity-90 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : status === "success" ? <><CheckCircle2 className="w-4 h-4 text-green-600" /> Sent!</> : "Send message"}
                    </button>
                </form>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}

// --- UTILS ---
const DynamicIcon = ({ iconType, emoji, iconLight, iconDark, theme, type }: any) => {
    if (type === 'linkedin') return <Linkedin />;
    if (type === 'twitter') return <Twitter />;
    if (type === 'instagram') return <Instagram />;
    if (iconType === 'image') {
        const src = theme === 'dark' ? (iconDark || iconLight) : (iconLight || iconDark);
        if (!src) return <span>?</span>;
        return <img src={src} alt="icon" className="w-6 h-6 object-cover" />;
    }
    return <span>{emoji || "🔗"}</span>;
};

const SkillPill = ({ name, icon: Icon, color }: any) => (<div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-200/50 dark:bg-[#111] rounded-full border border-neutral-300/50 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap"><Icon className={`w-3.5 h-3.5 ${color}`} /> <span>{name}</span></div>);
const row1 = [ { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" }, { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" }, { name: "Next.js", icon: SiNextdotjs, color: "text-black dark:text-white" }, { name: "React", icon: SiReact, color: "text-blue-400" }, { name: "Shadcn/ui", icon: SiShadcnui, color: "text-black dark:text-white" }, { name: "Material UI", icon: SiMui, color: "text-blue-600" } ];
const row2 = [ { name: "TailwindCSS", icon: SiTailwindcss, color: "text-cyan-400" }, { name: "CSS", icon: SiCss3, color: "text-blue-500" }, { name: "Express", icon: SiExpress, color: "text-black dark:text-white" }, { name: "Prisma", icon: SiPrisma, color: "text-teal-500" }, { name: "Firebase", icon: SiFirebase, color: "text-orange-500" }, { name: "Supabase", icon: SiSupabase, color: "text-green-400" } ];
const row3 = [ { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" }, { name: "Nginx", icon: SiNginx, color: "text-green-600" }, { name: "Android", icon: SiAndroid, color: "text-green-400" }, { name: "Linux", icon: SiLinux, color: "text-yellow-100" }, { name: "Figma", icon: SiFigma, color: "text-pink-500" } ];