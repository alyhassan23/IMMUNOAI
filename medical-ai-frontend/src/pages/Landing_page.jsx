import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/Sections/HeroSection";
import StatsSection from "../components/Sections/StatsSection";
import AboutSection from "../components/Sections/AboutSection";
import ServicesSection from "../components/Sections/ServicesSection";
import TestimonialsSection from "../components/Sections/TestimonialsSection";
import PricingSection from "../components/Sections/PricingSection";
import DoctorsSection from "../components/Sections/DoctorsSection";
import ContactSection from "../components/Sections/ContactSection"; // New Import

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
