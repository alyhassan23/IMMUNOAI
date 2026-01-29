import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={closeMenu}
            >
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ImmunoAI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              Doctors
            </Link>
            <Link
              to="/pricing"
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg transform transition-all duration-300 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 h-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
          <Link
            to="/"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={closeMenu}
          >
            About
          </Link>

          <Link
            to="/services"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={closeMenu}
          >
            Services
          </Link>

          <Link
            to="/doctors"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={closeMenu}
          >
            Doctors
          </Link>

          <Link
            to="/pricing"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={closeMenu}
          >
            Pricing
          </Link>

          <Link
            to="/contact"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={closeMenu}
          >
            Contact
          </Link>

          <div className="pt-4 mt-2 border-t border-gray-100">
            <Link
              to="/login"
              className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              onClick={closeMenu}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
