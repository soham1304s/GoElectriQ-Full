import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionP = motion.p;

export default function Loader() {
  const [isVisible, setIsVisible] = useState(() => sessionStorage.getItem('loaderShown') !== 'true');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return undefined;

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('loaderShown', 'true');
          }, 800);
          return 100;
        }
        return prev + (Math.random() * 15);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionDiv
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <MotionDiv 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/4 -right-1/4 w-full h-full bg-green-500/10 rounded-full blur-[120px]"
            />
            <MotionDiv 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-green-500/10 rounded-full blur-[120px]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Container */}
            <MotionDiv
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-12"
            >
              {/* Outer Pulse Rings */}
              {[1, 2].map((i) => (
                <MotionDiv
                  key={i}
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 border border-emerald-500/30 rounded-full"
                />
              ))}

              {/* Main Logo */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                <span className="text-5xl md:text-7xl font-black tracking-widest text-emerald-500 relative z-10 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">XYZ</span>
                
                {/* Inner Power Core Glow */}
                <MotionDiv 
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    scale: [0.8, 1.1, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"
                />
              </div>
            </MotionDiv>

            {/* Loading Protocol */}
            <div className="w-48 md:w-64 space-y-4">
              <div className="flex justify-between items-end">
                <MotionSpan 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] ml-1"
                >
                  Initializing Protocol
                </MotionSpan>
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div className="h-[2px] w-full bg-slate-800 rounded-full overflow-hidden relative">
                <MotionDiv 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />
                
                {/* Scanning Light Effect */}
                <MotionDiv
                  animate={{ 
                    left: ["-100%", "200%"]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </div>

              <MotionP 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]"
              >
                XYZ Energy Systems &copy; 2026
              </MotionP>
            </div>
          </div>

          {/* Footer Aesthetic */}
          <div className="absolute bottom-12 left-0 w-full flex justify-center">
            <div className="flex gap-4 opacity-20">
              <div className="w-8 h-1 bg-slate-700 rounded-full" />
              <div className="w-1 h-1 bg-green-500 rounded-full" />
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
