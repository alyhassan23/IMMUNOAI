import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AboutSection from "../components/Sections/AboutSection";
import StatsSection from "../components/Sections/StatsSection"; // Added Stats to About page as it fits well

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Page Header */}
      <div className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            About ImmunoAI
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We are a team of data scientists and neurologists dedicated to
            solving the diagnostic gap in autoimmune diseases.
          </p>
        </div>
      </div>

      <StatsSection />
      <AboutSection />

      <Footer />
    </div>
  );
};

export default AboutPage;
