import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PricingSection from "../components/Sections/PricingSection";
import { CreditCard, ShieldCheck } from "lucide-react";

const PricingPage = () => {
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
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-semibold mb-8 hover:bg-white/20 transition-colors cursor-default">
            <CreditCard size={16} className="text-emerald-400" />
            <span>Simple, Transparent Billing</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Plans &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Pricing
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed font-light">
            Flexible diagnostic packages designed for patients, private clinics,
            and large research institutions.
          </p>
        </div>
      </div>

      {/* --- Content Wrapper (Overlap Effect) --- */}
      <div className="relative z-20 -mt-24">
        <div className="bg-slate-50 rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-t border-white/50">
          {/* Pricing Section */}
          {/* We add 'pt-8' to give breathing room from the curve */}
          <div className="pt-8">
            <PricingSection />
          </div>

          {/* Enterprise / FAQ Teaser */}
          <div className="pb-20 pt-10 text-center max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Enterprise Security
            </h3>
            <p className="text-slate-500">
              All plans include HIPAA-compliant data handling, end-to-end
              encryption for MRI uploads, and secure payment processing via
              Stripe.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
