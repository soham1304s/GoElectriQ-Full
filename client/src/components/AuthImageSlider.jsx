import { createElement, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BatteryCharging, CarFront, MapPin, ShieldCheck } from "lucide-react";

const slides = [
  {
    image: "/auth-bg-premium.png",
    fallback: "/auth-bg.png",
    eyebrow: "Jaipur EV Network",
    title: "Clean electric mobility, made effortless.",
    description: "Book reliable EV rides and manage every trip from one secure GoElectriQ account."
  },
  {
    image: "/auth-bg.png",
    eyebrow: "City Rides",
    title: "A calmer way to move through the city.",
    description: "Plan your journey with a cleaner fleet, clear booking flow, and dependable service."
  },
  {
    image: "/auth-bg-2.png",
    eyebrow: "Smart Journeys",
    title: "Purpose-built for everyday electric travel.",
    description: "From airport rides to local routes, GoElectriQ keeps the experience simple and polished."
  }
];

const highlights = [
  { icon: CarFront, value: "Book", label: "EV rides" },
  { icon: MapPin, value: "Track", label: "city routes" },
  { icon: ShieldCheck, value: "Secure", label: "account" }
];

const MotionImg = motion.img;
const MotionDiv = motion.div;

export default function AuthImageSlider() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const activeSlide = slides[current];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <MotionImg
          key={activeSlide.image}
          src={activeSlide.image}
          alt={activeSlide.title}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.86, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            const fallback = activeSlide.fallback || "/auth-bg.png";
            if (!event.currentTarget.src.endsWith(fallback)) {
              event.currentTarget.src = fallback;
            }
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/15 to-slate-950/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-950/10 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white">
            <BatteryCharging size={18} className="text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-[0.24em]">GoElectriQ</span>
          </div>

          <div className="flex items-center gap-2" aria-label="Auth showcase slides">
            {slides.map((slide, idx) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show ${slide.eyebrow}`}
                onClick={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setCurrent(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === current
                  ? "w-8 bg-emerald-300"
                  : "w-2 bg-white/35 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeSlide.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-[390px]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-10 bg-amber-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-100">
                  {activeSlide.eyebrow}
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white">
                {activeSlide.title}
              </h2>
              <p className="mt-4 text-sm font-medium leading-6 text-slate-200/90">
                {activeSlide.description}
              </p>
            </MotionDiv>
          </AnimatePresence>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {highlights.map(({ icon, value, label }) => (
              <div key={label} className="rounded-lg border border-white/15 bg-white/[0.09] p-3 backdrop-blur-md">
                {createElement(icon, { size: 18, className: "mb-4 text-emerald-300" })}
                <p className="text-sm font-bold text-white">{value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
