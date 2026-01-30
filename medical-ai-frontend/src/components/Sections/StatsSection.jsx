import React, { useState, useEffect } from "react";
import { TrendingUp, Box, Activity, Scan } from "lucide-react";

// Helper Component for the Number Animation
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Ease-out expo formula for smooth landing
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-20 bg-white overflow-visible">
      {/* Background Decor (Subtle Light Blobs) */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100/50 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {/* Stat 1: Accuracy (Blue) */}
          <div className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 text-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <TrendingUp size={24} />
            </div>
            <div className="mt-6 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500 mb-2">
              <AnimatedCounter end={94} suffix="%" />
            </div>
            <div className="text-sm font-bold text-gray-400 tracking-wider uppercase group-hover:text-blue-600 transition-colors">
              Fusion Accuracy (AE)
            </div>
          </div>

          {/* Stat 2: 3D MRI (Purple) */}
          <div className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-purple-100 hover:border-purple-200 transition-all duration-300 hover:-translate-y-2 text-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-purple-600 mb-4 shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
              <Box size={24} />
            </div>
            <div className="mt-6 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500 mb-2 group-hover:animate-pulse">
              3D
            </div>
            <div className="text-sm font-bold text-gray-400 tracking-wider uppercase group-hover:text-purple-600 transition-colors">
              MRI Volume Analysis
            </div>
          </div>

          {/* Stat 3: Biomarkers (Emerald) */}
          <div className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-2 text-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600 mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Activity size={24} />
            </div>
            <div className="mt-6 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-500 mb-2">
              <AnimatedCounter end={15} suffix="+" />
            </div>
            <div className="text-sm font-bold text-gray-400 tracking-wider uppercase group-hover:text-emerald-600 transition-colors">
              Biomarkers Analyzed
            </div>
          </div>

          {/* Stat 4: XAI (Amber) */}
          <div className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-amber-100 hover:border-amber-200 transition-all duration-300 hover:-translate-y-2 text-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-amber-600 mb-4 shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
              <Scan size={24} />
            </div>
            <div className="mt-6 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-500 mb-2">
              XAI
            </div>
            <div className="text-sm font-bold text-gray-400 tracking-wider uppercase group-hover:text-amber-600 transition-colors">
              SHAP & Grad-CAM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
