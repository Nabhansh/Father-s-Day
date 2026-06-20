import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import WelcomePage from "./components/WelcomePage";
import Letter from "./components/Letter";
import FinalPage from "./components/FinalPage";
import MusicControls from "./components/MusicControls";
import Navigation from "./components/Navigation";
import ThreeCanvas from "./components/ThreeCanvas";

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [musicStarted, setMusicStarted] = useState<boolean>(false);

  const totalPages = 3;

  // Auto-start music when site loads
  useEffect(() => {
    setMusicStarted(true);
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  };

  const goToPage = (index: number) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
  };

  const startMusic = () => {
    setMusicStarted(true);

    if (currentPage === 0) {
      nextPage();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        nextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage]);

  const renderOverlayContent = () => {
    switch (currentPage) {
      case 0:
        return <WelcomePage onStartMusic={startMusic} />;
      case 1:
        return <Letter />;
      case 2:
        return <FinalPage />;
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-white overflow-hidden relative font-sans select-none">
      {/* Three.js Scene */}
      <ThreeCanvas currentPage={currentPage} />

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-[30vw] h-[30vh] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[40vw] h-[40vh] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* Music */}
      <MusicControls
        musicStarted={musicStarted}
        onStartMusic={startMusic}
      />

      {/* Navigation */}
      {currentPage > 0 && (
        <Navigation
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={nextPage}
          onPrev={prevPage}
          onGoTo={goToPage}
        />
      )}

      {/* Pages */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 150 : -150 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -150 : 150 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
            }}
            className="w-full h-full relative"
          >
            {renderOverlayContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="fixed bottom-4 right-4 text-[10px] md:text-xs text-white/30 pointer-events-none select-none z-50 font-mono tracking-tight"
      >
        Made with ❤️ for Dad
      </motion.div>
    </div>
  );
}