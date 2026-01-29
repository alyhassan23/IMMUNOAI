import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PricingSection from "../components/Sections/PricingSection";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Page Header */}
      <div className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Plans & Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Flexible diagnostic packages for patients, clinics, and research
            institutions.
          </p>
        </div>
      </div>

      <PricingSection />

      <Footer />
    </div>
  );
};

export default PricingPage;
