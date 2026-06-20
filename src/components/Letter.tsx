import React from "react";
import { motion } from "motion/react";
import { Terminal, Lock } from "lucide-react";

export default function Letter() {
  return (
    <div className="absolute inset-0 flex items-center justify-center md:justify-end pointer-events-none px-4 md:px-20 py-24 select-text z-10">
      <motion.div
        className="pointer-events-auto w-full max-w-lg bg-slate-950/85 backdrop-blur-2xl rounded-2xl p-6 md:p-8 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col max-h-[80vh] overflow-y-auto selection:bg-cyan-500 selection:text-white relative"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.7, type: "spring", damping: 20 }}
      >
        {/* Futuristic cyber decoration corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

        {/* Faint futuristic grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-2xl" />

        {/* Futuristic Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4 mb-5 select-none font-mono text-[10px] text-cyan-400">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5 animate-pulse text-cyan-500" />
            <span>TRANSMISSION ID: 1989_PATER</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>ENCRYPTED_OK</span>
          </div>
        </div>

        {/* Title */}
        <motion.h2
          className="text-2xl md:text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent select-none filter drop-shadow-sm uppercase tracking-wider"
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          A Letter From My Heart
        </motion.h2>

        {/* Content */}
        <div className="space-y-4 md:space-y-5 text-gray-200 text-sm md:text-base font-light leading-relaxed text-left flex-1 relative z-10">
          <motion.p
            className="text-cyan-400 italic text-base md:text-lg font-bold mb-3 tracking-widest uppercase font-mono"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Dear Dad,
          </motion.p>

          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Words cannot express how grateful I am to have you as my father. You've been my rock, my inspiration, and my biggest cheerleader through every step of my journey.
          </motion.p>

          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            From teaching me to tie my shoes to helping me navigate life's biggest challenges, you've always been there with patience, wisdom, and unconditional love.
          </motion.p>

          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            Your strength has shown me how to be resilient, your kindness has taught me compassion, and your humor has filled our home with laughter and joy.
          </motion.p>

          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            Thank you for all the sacrifices you've made, the dreams you've helped me chase, and the love you've given so freely. I am who I am today because of you.
          </motion.p>

          <motion.p
            className="text-pink-400 font-bold text-lg md:text-xl text-center py-4 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-transparent rounded-xl border border-pink-500/20 font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(236,72,153,0.1)]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            I love you more than words can say, Dad!
          </motion.p>
        </div>

        {/* Signature */}
        <div className="text-right mt-6 border-t border-white/5 pt-5 select-none z-10">
          <motion.p
            className="text-cyan-400 font-bold text-sm md:text-base leading-tight font-mono tracking-wide"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            WITH ALL MY LOVE,
            <br />
            <span className="text-pink-400 font-black text-base md:text-lg tracking-widest">YOUR CHILD ❤️</span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
