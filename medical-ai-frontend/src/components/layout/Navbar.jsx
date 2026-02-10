import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Menu,
  X,
  ChevronRight,
  UserPlus,
  Stethoscope,
  User,
} from "lucide-react";

const Navbar = ({ lightMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRegisterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
                className={`relative px-3 py-2 text-sm font-semibold rounded-full transition-all duration-200 group ${textColorClass} ${!scrolled && lightMode ? "hover:bg-white/10" : "hover:bg-blue-50/50"}`}
              >
                {link.name}
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-1/2 opacity-0 group-hover:opacity-100 ${lightMode && !scrolled ? "bg-white" : "bg-blue-600"}`}
                ></span>
              </Link>
            ))}

            <div
              className={`pl-4 ml-4 border-l h-6 ${scrolled || !lightMode ? "border-gray-200" : "border-white/20"}`}
            ></div>

            {/* Login Link */}
            <Link
              to="/login"
              className={`ml-4 px-4 py-2 text-sm font-bold rounded-full transition-colors ${textColorClass} hover:bg-black/5`}
            >
              Login
            </Link>

            {/* Register Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setRegisterOpen(!registerOpen)}
                className={`px-5 py-2.5 text-sm font-bold rounded-full shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 ${scrolled || !lightMode ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/30" : "text-blue-900 bg-white shadow-black/10 hover:shadow-black/20"}`}
              >
                Get Started{" "}
                <ChevronRight
                  size={14}
                  className={`transition-transform duration-200 ${registerOpen ? "rotate-90" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200 origin-top-right ${registerOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
              >
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Register as
                  </p>
                  <Link
                    to="/register-patient"
                    onClick={() => setRegisterOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User size={16} />
                    </div>
                    <div>
                      <span className="block text-sm font-bold">Patient</span>
                      <span className="block text-xs text-gray-400">
                        Get diagnosed
                      </span>
                    </div>
                  </Link>
                  <Link
                    to="/register-doctor"
                    onClick={() => setRegisterOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group mt-1"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Stethoscope size={16} />
                    </div>
                    <div>
                      <span className="block text-sm font-bold">Doctor</span>
                      <span className="block text-xs text-gray-400">
                        Join network
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
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

      {/* --- Mobile Menu Dropdown --- */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-5 invisible"
        }`}
      >
        <div className="px-4 py-6 space-y-2 max-h-[85vh] overflow-y-auto">
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

          <div className="pt-6 mt-4 border-t border-gray-100 space-y-3">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Account Access
            </p>

            <Link
              to="/login"
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              Log In
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/register-patient"
                className="flex flex-col items-center justify-center px-2 py-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                onClick={closeMenu}
              >
                <User size={20} className="mb-1" />
                <span className="text-sm font-bold">Patient Sign Up</span>
              </Link>
              <Link
                to="/register-doctor"
                className="flex flex-col items-center justify-center px-2 py-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
                onClick={closeMenu}
              >
                <Stethoscope size={20} className="mb-1" />
                <span className="text-sm font-bold">Doctor Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
