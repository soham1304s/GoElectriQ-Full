import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const MapMockup = ({ pickupLocation, dropLocation, className = "" }) => {
  return (
    <div className={`relative w-full h-full min-h-[300px] bg-slate-900 overflow-hidden rounded-2xl group ${className}`}>
      {/* Background Mockup Image */}
      <img 
        src="/images/map_mockup.png" 
        alt="Map Mockup" 
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
      />
      
      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />
      
      {/* Animated Route Pulse (Simulated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 border-[1px] border-emerald-500/20 rounded-full animate-ping opacity-20" />
      </div>

      {/* Floating Info Overlays */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-xl shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Route Visualization</span>
          </div>
          <p className="text-xs font-bold text-white max-w-[150px] truncate">
            {pickupLocation || "Pickup Point"}
          </p>
        </div>

        {dropLocation && (
          <div className="bg-emerald-600/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl animate-fadeIn animate-delay-200">
            <div className="flex items-center gap-2 mb-1">
              <Navigation size={10} className="text-green-50" />
              <span className="text-[10px] font-black text-green-50 uppercase tracking-widest">Destination</span>
            </div>
            <p className="text-xs font-bold text-white max-w-[150px] truncate">
              {dropLocation}
            </p>
          </div>
        )}
      </div>

      {/* Center Marker Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full pointer-events-none">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Premium Fleet Coverage Area</p>
      </div>
    </div>
  );
};

export default MapMockup;
