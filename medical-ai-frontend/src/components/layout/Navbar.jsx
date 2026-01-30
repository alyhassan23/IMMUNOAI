import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, Menu, X, ChevronRight } from "lucide-react";

// Added 'lightMode' prop. If true, text starts white (for dark backgrounds).
const Navbar = ({ lightMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Doctors", path: "/doctors" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  // Dynamic Text Color Logic
  // If scrolled -> Dark Text (Gray-700)
  // If NOT scrolled & lightMode is ON -> White Text
  // If NOT scrolled & lightMode is OFF -> Dark Text (Gray-600)
  const textColorClass = scrolled
    ? "text-gray-600 hover:text-blue-600"
    : lightMode
      ? "text-white/90 hover:text-white"
      : "text-gray-600 hover:text-blue-600";

  const logoColorClass = scrolled
    ? "from-gray-900 to-gray-700"
    : lightMode
      ? "from-white to-blue-100"
      : "from-gray-900 to-gray-700";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* --- Logo Section --- */}
          <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <div
                className={`p-2 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 ${scrolled || !lightMode ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-500/20" : "bg-white/20 backdrop-blur-md border border-white/20"}`}
              >
                <Brain
                  className={`h-6 w-6 transition-transform duration-300 group-hover:rotate-12 ${scrolled || !lightMode ? "text-white" : "text-white"}`}
                />
              </div>
              <span
                className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${logoColorClass}`}
              >
                ImmunoAI
              </span>
            </Link>
          </div>

          {/* --- Desktop Menu --- */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 group ${textColorClass} ${!scrolled && lightMode ? "hover:bg-white/10" : "hover:bg-blue-50/50"}`}
              >
                {link.name}
                {/* Subtle underline animation */}
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100 ${lightMode && !scrolled ? "bg-white" : "bg-blue-600"}`}
                ></span>
              </Link>
            ))}

            <div
              className={`pl-4 ml-4 border-l h-6 ${scrolled || !lightMode ? "border-gray-200" : "border-white/20"}`}
            ></div>

            <Link
              to="/login"
              className={`ml-4 px-6 py-2.5 text-sm font-bold rounded-full shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${scrolled || !lightMode ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/30" : "text-blue-900 bg-white shadow-black/10 hover:shadow-black/20"}`}
            >
              Login
            </Link>
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${textColorClass}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Dropdown (Unchanged logic, just ensure text is visible) --- */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-5 invisible"
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              onClick={closeMenu}
            >
              {link.name}
              <ChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}

          <div className="pt-6 mt-4 border-t border-gray-100">
            <Link
              to="/login"
              className="block w-full text-center px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
              onClick={closeMenu}
            >
              Access Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
