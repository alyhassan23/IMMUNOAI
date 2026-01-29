import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DoctorsSection from "../components/Sections/DoctorsSection";

const DoctorsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Page Header */}
      <div className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Medical Board
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Meet the experts behind our AI verification and patient care
            protocols.
          </p>
        </div>
      </div>

      <DoctorsSection />

      <Footer />
    </div>
  );
};

export default DoctorsPage;
