"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

// UPDATED LINKS: Changed "Projects" to "Work" and href to "/work"
const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Work", href: "/work" }, 
  { name: "Blog", href: "/blog" },
  { name: "Reach", href: "/#reach" },
];

export const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  // Motion value for the "Dock" effect
  let mouseX = useMotionValue(Infinity);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const isDark = resolvedTheme === "dark";
    const newTheme = isDark ? "light" : "dark";
    const color = newTheme === "dark" ? "#ffffff" : "#000000";

    const confettiConfig = {
      particleCount: 40,
      spread: 60,
      colors: [color],
      disableForReducedMotion: true,
      zIndex: 100,
      startVelocity: 35,
    };
    confetti({ ...confettiConfig, angle: 60, origin: { x: 0, y: 0.6 } });
    confetti({ ...confettiConfig, angle: 120, origin: { x: 1, y: 0.6 } });
    confetti({ ...confettiConfig, angle: 270, origin: { x: 0.5, y: -0.1 }, spread: 120, gravity: 1.2 });

    setTheme(newTheme);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center py-4 md:py-6 pointer-events-none"
    >
      {/* Container: tracks mouse for dock effect */}
      <div 
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => { mouseX.set(Infinity); setHoveredPath(null); }}
        className="relative flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm pointer-events-auto transition-all duration-300"
      >
        
        {/* --- DESKTOP NAVIGATION (APPLE DOCK + SLIDING PILL) --- */}
        <div className="hidden md:flex items-end gap-1 px-1">
            {navItems.map((item) => (
                <DockIcon key={item.name} mouseX={mouseX} href={item.href} setHoveredPath={setHoveredPath} hoveredPath={hoveredPath}>
                    {item.name}
                </DockIcon>
            ))}
        </div>

        {/* --- MOBILE MENU TOGGLE --- */}
        <div className="md:hidden flex items-center">
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
             >
                <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                        <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                            <X className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                        </motion.div>
                    ) : (
                        <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                            <Menu className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                        </motion.div>
                    )}
                </AnimatePresence>
             </button>
             <span className="text-sm font-semibold pl-2 pr-4 text-neutral-800 dark:text-neutral-200">Menu</span>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />

        {/* --- THEME TOGGLE (ANIMATED) --- */}
        <button onClick={toggleTheme} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {!mounted ? (
               <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
            ) : resolvedTheme === "dark" ? (
               <motion.div key="moon" initial={{ y: -20, opacity: 0, rotate: -45 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 45 }} transition={{ duration: 0.2 }}>
                 <Moon className="w-4 h-4 text-white" />
               </motion.div>
            ) : (
               <motion.div key="sun" initial={{ y: -20, opacity: 0, rotate: 45 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: -45 }} transition={{ duration: 0.2 }}>
                 <Sun className="w-4 h-4 text-black" />
               </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-20 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2 flex flex-col shadow-2xl w-[200px] pointer-events-auto md:hidden"
            >
                {navItems.map((item) => (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all">
                        {item.name}
                    </Link>
                ))}
            </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// --- DOCK ICON COMPONENT ---
function DockIcon({ mouseX, children, href, setHoveredPath, hoveredPath }: { mouseX: any, children: React.ReactNode, href: string, setHoveredPath: any, hoveredPath: string | null }) {
    const ref = useRef<HTMLDivElement>(null);

    // Calculate distance from mouse to center of this element
    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.15, 1]);
    const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <Link href={href} onMouseEnter={() => setHoveredPath(href)}>
            <motion.div
                ref={ref}
                style={{ scale }}
                className="relative px-4 py-2 rounded-full cursor-pointer transition-colors origin-bottom z-10"
            >
                {hoveredPath === href && (
                    <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white">
                    {children}
                </span>
            </motion.div>
        </Link>
    );
}
