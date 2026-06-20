import React, { useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Sparkles, Calendar, Heart } from "lucide-react";

export default function FinalPage() {
  // Auto-trigger screenspace confetti when final page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2500;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Burst confetti from multiple bottom positions
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 },
          colors: ["#22d3ee", "#e879f9", "#818cf8", "#fbbf24", "#34d399", "#f87171"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 },
          colors: ["#22d3ee", "#e879f9", "#818cf8", "#fbbf24", "#34d399", "#f87171"],
        });
      }, 200);

      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleCelebrate = () => {
    // Manual confetti trigger from the center bottom
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: [
        "#22d3ee",
        "#e879f9",
        "#818cf8",
        "#fbbf24",
        "#34d399",
        "#f87171",
        "#ec4899",
        "#ab00ff",
      ],
    });
  };

  return (
    <div className="absolute inset-x-0 top-0 bottom-24 flex flex-col items-center justify-between pointer-events-none px-4 z-10 py-8 md:py-12 select-none">
      {/* Celebration Header */}
      <div className="text-center max-w-4xl mx-auto w-full flex flex-col items-center relative py-6 px-10 bg-slate-950/70 backdrop-blur-md rounded-3xl border border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.15)] pointer-events-auto">
        
        {/* Hologram badge */}
        <div className="mb-4 flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 tracking-[0.2em] uppercase bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Calendar className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>CELEBRATION GRID STATUS: OVERLOAD</span>
        </div>

        <motion.h2
          className="text-4xl md:text-7xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent px-4 py-1.5 tracking-tight select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] uppercase"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Happy Father's Day!
        </motion.h2>

        <motion.div
          className="text-5xl md:text-6xl mb-4 pointer-events-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.span
            className="inline-block cursor-pointer filter drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onClick={handleCelebrate}
          >
            🚀
          </motion.span>
        </motion.div>

        <motion.p
          className="text-base md:text-2xl text-slate-100 mb-2 font-mono tracking-wide px-4 max-w-2xl text-center pointer-events-auto"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          YOU ARE THE GREATEST DAD IN THE MULTIVERSE.
        </motion.p>

        <motion.p
          className="text-xs md:text-sm text-cyan-400 font-bold px-4 tracking-[0.3em] uppercase select-none pointer-events-auto font-mono flex items-center gap-1.5"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span>MISSION ACCOMPLISHED WITH PURE GRATITUDE</span>
          <Heart className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400 animate-ping" />
        </motion.p>
      </div>

      {/* Manual Celebrate block and footer */}
      <div className="flex flex-col items-center w-full max-w-lg mb-4 text-center">
        {/* Manual celebrate CTA */}
        <motion.button
          className="pointer-events-auto bg-gradient-to-r from-cyan-500 via-pink-400 to-indigo-500 hover:from-cyan-600 hover:via-pink-500 hover:to-indigo-600 text-white font-black py-4 px-10 rounded-xl text-sm md:text-base shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_45px_rgba(236,72,153,0.5)] border border-white/20 transition-all duration-300 mt-2 mb-6 cursor-pointer font-mono tracking-widest uppercase"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCelebrate}
        >
          DETONATE CELEBRATION 🎊
        </motion.button>

        {/* Small card message */}
        <motion.div
          className="p-5 bg-slate-950/85 rounded-2xl border border-cyan-500/20 backdrop-blur-md w-full relative"
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <p className="text-xs md:text-sm text-slate-300 font-mono uppercase leading-relaxed">
            SYSTEM FEEDBACK: [ THANK YOU FOR ALWAYS GUIDING AND SUPPORTING MY CODE, MY PATH, AND MY DREAMS. ]
            <br />
            <span className="text-pink-400 font-black block mt-2 tracking-widest text-xs md:text-sm">HAPPY FATHER'S DAY, DAD!</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
