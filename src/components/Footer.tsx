"use client";
import React, { useEffect, useState } from "react";
import { Sparkles, Heart } from "lucide-react"; // Added Heart
import confetti from "canvas-confetti";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Footer() {
  const [name, setName] = useState("Samarth Saxena");

  useEffect(() => {
    getDoc(doc(db, "content", "profile")).then(s => {
      if (s.exists() && s.data().name) setName(s.data().name);
    });
  }, []);

  const triggerCelebration = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <footer className="border-t border-neutral-200 dark:border-zinc-800 py-8 mt-auto"> {/* mt-auto helps push it down */}
        <div className="max-w-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-neutral-500 flex items-center">
                Thank you for visiting! <Heart className="inline-block w-3.5 h-3.5 text-red-500 ml-1 fill-red-500" />
            </div>
            
            <button 
                onClick={triggerCelebration}
                className="flex items-center gap-2 bg-neutral-100 dark:bg-[#111] border border-neutral-200 dark:border-zinc-800 px-4 py-2 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-zinc-800 transition group"
            >
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 group-hover:animate-spin" />
                <span>Celebrate</span>
            </button>
        </div>
    </footer>
  );
}
