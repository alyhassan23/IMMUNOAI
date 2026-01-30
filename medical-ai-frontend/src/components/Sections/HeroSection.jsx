import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  Brain,
  ScanLine,
  ShieldCheck,
  Zap,
} from "lucide-react";

const HeroSection = () => {
  // --- Typewriter Logic ---
  const words = [
    "Pemphigus Vulgaris",
    "Autoimmune Encephalitis",
    "Rare Disorders",
  ];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1500);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(
      () => setSubIndex((prev) => prev + (reverse ? -1 : 1)),
      reverse ? 50 : 100,
    );
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  // --- Mouse Parallax Effect ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePosition({ x, y });
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex items-center bg-slate-50 overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-24"
    >
      {/* FIX: Added 'pt-28 lg:pt-32' above. 
         This forces the content down so it never collides with the fixed Navbar.
      */}

      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Interactive Blobs */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- LEFT COLUMN: Text Content --- */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/60 border border-blue-200 shadow-sm backdrop-blur-sm text-blue-700 text-xs sm:text-sm font-semibold mb-8 hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Fusion ANN & Ensemble Stacking Architecture
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
              Precision <br className="hidden lg:block" />
              Diagnostics for <br />
              <span className="relative inline-block mt-2">
                {/* Text Gradient */}
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  {`${words[index].substring(0, subIndex)}`}
                </span>
                <span className="ml-1 text-purple-600 animate-pulse font-light">
                  |
                </span>

                {/* Decoration underline - FIX: Lowered bottom position to -bottom-2 or -bottom-3 */}
                <svg
                  className="absolute w-full h-3 -bottom-3 left-0 text-blue-400/30 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              ImmunoAI bridges the diagnostic gap. We combine
              <span className="font-semibold text-slate-800">
                {" "}
                MRI Deep Learning (ResNet50)
              </span>{" "}
              with
              <span className="font-semibold text-slate-800">
                {" "}
                Clinical Ensemble Models
              </span>{" "}
              to detect rare autoimmune disorders with over
              <span className="bg-green-100 text-green-700 px-1 rounded mx-1 font-bold">
                99.2%
              </span>
              specificity.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                <span className="relative z-20 flex items-center">
                  Start Analysis{" "}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 shadow-sm"
              >
                View Architecture
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-sm font-medium grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex items-center gap-1">
                <ShieldCheck size={16} /> HIPPA Compliant
              </div>
              <div className="flex items-center gap-1">
                <Zap size={16} /> Real-time Inference
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Interactive Visual Element --- */}
          <div className="relative hidden lg:block perspective-1000">
            <div
              className="relative w-full max-w-md mx-auto bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl p-6 transform transition-transform duration-100 ease-out hover:scale-[1.02]"
              style={{
                transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100/80 rounded-lg text-blue-600">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Neural Scan</h3>
                    <p className="text-xs text-slate-500">
                      ResNet50 Processing
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-400/60"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400/60"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400/60"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Pattern Recognition</span>
                    <span>99.8%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[99.8%] animate-[widthGrow_2s_ease-out]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Biomarker Analysis</span>
                    <span>84.2%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[84.2%] animate-[widthGrow_2.5s_ease-out]"></div>
                  </div>
                </div>

                <div className="mt-6 relative h-32 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center">
                  <Activity className="text-blue-500/40 w-full h-16 absolute animate-pulse" />
                  <ScanLine className="text-purple-600 absolute w-8 h-full animate-[scan_3s_linear_infinite]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      Confidence
                    </p>
                    <p className="text-xl font-bold text-green-600">High</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      Latency
                    </p>
                    <p className="text-xl font-bold text-blue-600">42ms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
