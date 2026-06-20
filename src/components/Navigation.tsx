import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
}

export default function Navigation({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  onGoTo,
}: NavigationProps) {
  const pageNames = ["WELCOME", "TRANSMIT", "CELEBRATE"];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div
        className="flex items-center gap-3 md:gap-4 bg-slate-950/90 backdrop-blur-xl rounded-xl px-4 md:px-6 py-3 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)] relative"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {/* Futuristic neon styling brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />

        {/* Previous button */}
        <motion.button
          onClick={onPrev}
          disabled={currentPage === 0}
          className="p-1.5 md:p-2 rounded border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-400 disabled:opacity-20 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
        </motion.button>

        {/* Page indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <motion.button
              key={i}
              onClick={() => onGoTo(i)}
              className={`w-3 h-3 rounded-none transition-all duration-300 cursor-pointer border ${
                i === currentPage
                  ? "bg-cyan-400 border-cyan-400 rotate-45 scale-125 shadow-[0_0_12px_rgba(34,211,238,1)]"
                  : "bg-transparent border-cyan-500/40 hover:border-cyan-400 rotate-45"
              }`}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.85 }}
            />
          ))}
        </div>

        {/* Sector Nav Name */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded border border-cyan-500/10 text-cyan-400 font-mono text-[10px] md:text-xs font-bold min-w-[100px] md:min-w-[125px] justify-center tracking-widest uppercase select-none">
          <Compass className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
          <span>{pageNames[currentPage]}</span>
        </div>

        {/* Next button */}
        <motion.button
          onClick={onNext}
          disabled={currentPage === totalPages - 1}
          className="p-1.5 md:p-2 rounded border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-400 disabled:opacity-20 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
        </motion.button>
      </motion.div>
    </div>
  );
}
