import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DoctorsSection from "../components/Sections/DoctorsSection"; // Ensure this matches your file name
import { Stethoscope, Award } from "lucide-react";

const DoctorsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Navbar with white text mode for dark header */}
      <Navbar lightMode={true} />

      {/* --- Page Header --- */}
      <div className="relative bg-slate-900 pt-32 pb-48 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-semibold mb-8 hover:bg-white/20 transition-colors cursor-default">
            <Award size={16} className="text-yellow-400" />
            <span>Board Certified Specialists</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Medical Board
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed font-light">
            Meet the world-class neurologists and immunologists behind our{" "}
            <span className="text-white font-medium">AI verification</span> and
            patient care protocols.
          </p>
        </div>
      </div>

      {/* --- Content Wrapper (Overlap Effect) --- */}
      <div className="relative z-20 -mt-24">
        <div className="bg-slate-50 rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-t border-white/50">
          {/* Doctors Grid Section */}
          {/* Added padding top to separate from the curve */}
          <div className="pt-8">
            <DoctorsSection />
          </div>

          {/* Optional: Call to Action at bottom of list */}
          <div className="py-20 text-center max-w-4xl mx-auto px-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
              <Stethoscope size={32} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Need a Second Opinion?
            </h3>
            <p className="text-lg text-slate-500 mb-8">
              Our specialists are available for direct tele-consultation to
              review your AI diagnostic reports.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorsPage;
