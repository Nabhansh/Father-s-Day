import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

interface MusicControlsProps {
  musicStarted: boolean;
  onStartMusic: () => void;
}

export default function MusicControls({ musicStarted, onStartMusic }: MusicControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync state when music is started from the welcome CTA
  useEffect(() => {
    if (musicStarted && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.volume = 0.45;
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay block or audio play failed", err);
      });
    }
  }, [musicStarted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio controls error", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    if (!musicStarted) {
      onStartMusic();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 pointer-events-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <motion.button
        onClick={toggleMusic}
        className="bg-slate-950/90 hover:bg-slate-900/90 backdrop-blur-md text-white p-3 md:p-3.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer relative"
        title={isPlaying ? "Pause Transmission Audio" : "Boot Transmission Audio"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Fututistic neon brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
        
        <audio ref={audioRef} src="/bg.mp3" loop preload="auto" />
        <div className="flex items-center gap-1.5 px-0.5 select-none font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">AUDIO: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">AUDIO: MUTE</span>
            </>
          )}
        </div>
      </motion.button>
    </motion.div>
  );
}
