import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Activity } from "lucide-react";

const HeroSection = () => {
  // --- Typewriter Logic ---
  const words = [
    "Autoimmune Encephalitis",
    "Pemphigus Vulgaris",
    "Rare Disorders",
  ];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1500); // Wait before starting to delete
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 50 : 100,
    ); // Speed: Deleting is faster than typing

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);
  // -----------------------

  return (
    <section
      id="home"
      className="relative bg-white overflow-hidden border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100">
            <Activity className="h-4 w-4 mr-2" />
            Hybrid AI Framework: Fusion ANN & Ensemble Stacking
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            Precision Diagnostics for <br />
            {/* TYPEWRITER EFFECT APPLIED HERE */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 min-h-[1.2em] inline-block">
              {`${words[index].substring(0, subIndex)}`}
              <span className="text-blue-600 animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-3xl mx-auto">
            ImmunoAI bridges the diagnostic gap using a{" "}
            <strong>Dual-Head Architecture</strong>. We combine MRI Deep
            Learning (ResNet50) with Clinical Ensemble Models (XGBoost/LightGBM)
            to detect rare autoimmune disorders with high specificity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
            >
              Start Diagnostic Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-lg font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              View Architecture
            </Link>
          </div>
        </div>
      </div>

      {/* Background Blob Effect */}
      <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>
    </section>
  );
};

export default HeroSection;
