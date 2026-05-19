import { motion } from 'framer-motion';
import AuthImageSlider from '../AuthImageSlider';

import { useTheme } from '../../context/ThemeContext';

const MotionDiv = motion.div;
const MotionImg = motion.img;

export default function AuthLayout({ children, title, subtitle, showSlider = true }) {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 overflow-hidden transition-colors duration-500 relative">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-screen sm:min-h-0 lg:h-[calc(100vh-4rem)] lg:min-h-[640px] lg:max-h-[820px] max-w-[1180px] bg-white sm:rounded-[2rem] shadow-[0_24px_70px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col lg:flex-row relative z-10 border-none sm:border border-slate-100"
      >
        {/* Visual Showcase - Left Side (Hidden on Mobile) */}
        {showSlider && (
          <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-slate-950 h-full">
            <AuthImageSlider />
          </div>
        )}

        {/* Form - Right Side */}
        <div className={`w-full ${showSlider ? 'lg:w-[54%]' : 'lg:w-full'} min-h-screen sm:min-h-0 h-full flex flex-col bg-white overflow-hidden`}>
          {/* Mobile Logo / Header - Compact */}
          <div className="p-6 pb-0 sm:p-8 sm:pb-0 lg:p-12 lg:pb-0 flex flex-col items-center lg:items-start shrink-0">
            <MotionDiv
              className="text-3xl font-black tracking-widest text-emerald-600 dark:text-emerald-400 mb-4"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              XYZ
            </MotionDiv>
            <div className="mt-4 text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
              <p className="text-slate-500 text-xs font-medium tracking-wide mt-1">{subtitle}</p>
            </div>
          </div>

          {/* Scrollable Form Area - Scrollbar Hidden */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
            {children}
          </div>
        </div>
      </MotionDiv>

      {/* Security Footer - Subtle */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 text-slate-400">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Secure AES-256 Connection</span>
      </div>
    </div>
  );
}
