import React from "react";
import { motion } from "motion/react";
import { Heart, ShieldCheck, Cpu } from "lucide-react";

interface WelcomePageProps {
  onStartMusic: () => void;
}

export default function WelcomePage({ onStartMusic }: WelcomePageProps) {
  return (
    <div className="absolute inset-x-0 bottom-12 top-0 flex flex-col items-center justify-center pointer-events-none px-4 z-10">
      {/* High-tech overlay panels/brackets */}
      <div className="absolute inset-x-10 top-10 bottom-24 border-l border-t border-cyan-500/10 rounded-tl-3xl pointer-events-none hidden md:block select-none font-mono text-[10px] text-cyan-400/30 p-4">
        SYS_VER: 2049.FATHER // COMPATIBILITY: 100%
      </div>
      <div className="absolute inset-x-10 top-10 bottom-24 border-r border-b border-pink-500/10 rounded-br-3xl pointer-events-none hidden md:block select-none text-right flex items-end justify-end p-4 font-mono text-[10px] text-pink-400/30">
        LATENCY: 0.0ms // ENGAGEMENT: MAX
      </div>

      <div className="text-center max-w-2xl mx-auto w-full flex flex-col items-center relative py-8 px-6 bg-slate-950/40 backdrop-blur-md rounded-3xl border border-cyan-500/15 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        {/* Futuristic top sub-header */}
        <motion.div
          className="flex items-center gap-2 font-mono text-xs text-cyan-400 tracking-[0.25em] uppercase mb-6 pointer-events-auto select-none bg-cyan-950/30 px-3.5 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
          <span>ESTABLISHING HERO_DAD LINK v4.0</span>
        </motion.div>

        {/* Animated 3D Floating Emoji container */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
            duration: 0.8,
          }}
          className="mb-4 pointer-events-auto"
        >
          <motion.div
            className="text-7xl md:text-8xl select-none filter drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🤖
          </motion.div>
        </motion.div>

        {/* Beautiful Futuristic Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-400 bg-clip-text text-transparent px-4 tracking-tight select-none filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.2)] pointer-events-auto uppercase"
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        >
          For the Ultimate Dad
        </motion.h1>

        {/* Heartfelt paragraph */}
        <motion.p
          className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed font-light px-4 max-w-xl text-center pointer-events-auto"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
        >
          Analyzing dad metrics... <span className="text-cyan-400 font-semibold font-mono">STRENGTH: INFINITE</span> • <span className="text-pink-400 font-semibold font-mono">SUPPORT: ETERNAL</span>. You have always been my hero, my pilot, and my guiding star. 
          <span className="text-slate-400 block mt-2 text-xs uppercase tracking-wider font-mono">
            [ INITIATING MEMORY ENCRYPTION PROTOCOL ]
          </span>
        </motion.p>

        {/* Start button to kick off experience and music */}
        <motion.button
          className="group pointer-events-auto bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 hover:from-cyan-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-4 px-10 rounded-xl text-base md:text-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] active:scale-95 transition-all duration-300 flex items-center gap-3 relative overflow-hidden border border-white/20 cursor-pointer uppercase tracking-widest font-mono"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartMusic}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Heart className="w-5 h-5 relative z-10 fill-white animate-pulse text-pink-200" />
          <span className="relative z-10">BOOT THE CARD</span>
        </motion.button>

        <motion.div
          className="mt-6 font-mono text-[10px] text-purple-400 select-none pointer-events-auto flex items-center gap-1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>FATHER'S DAY SECTOR: SECURE</span>
        </motion.div>
      </div>
    </div>
  );
}
