import React from "react";
import Navbar from "../components/layout/Navbar"; // Ensure correct path
import Footer from "../components/layout/Footer"; // Ensure correct path
import ContactSection from "../components/Sections/ContactSection"; // Ensure correct path
import { LifeBuoy } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* UPDATE: Pass lightMode={true} here */}
      <Navbar lightMode={true} />

      {/* --- Page Header --- */}
      <div className="relative bg-slate-900 pt-32 pb-48 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-semibold mb-8 hover:bg-white/20 transition-colors cursor-default">
            <LifeBuoy size={16} className="animate-pulse" />
            <span>24/7 Technical Support</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Touch
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-light">
            We are here to help you revolutionize your diagnostic workflow.
            Reach out for{" "}
            <span className="text-white font-medium">
              partnership inquiries
            </span>{" "}
            or{" "}
            <span className="text-white font-medium">technical assistance</span>
            .
          </p>
        </div>
      </div>

      {/* --- Content Wrapper (The Overlap Effect) --- */}
      <div className="relative z-20 -mt-24">
        <div className="bg-slate-50 rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-t border-white/50">
          <div className="pt-6">
            <ContactSection />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
