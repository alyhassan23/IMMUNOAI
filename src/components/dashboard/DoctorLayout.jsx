import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  UserCog,
  LogOut,
  Menu,
  Stethoscope,
  Bell,
} from "lucide-react";

const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- NEW: Dynamic User State ---
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");

    // Security Check: If not a doctor, kick them out
    if (role !== "doctor") {
      navigate("/login");
    }

    if (name) {
      // Ensure "Dr." prefix is handled nicely
      setDoctorName(name.startsWith("Dr.") ? name : `Dr. ${name}`);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  // -------------------------------

  const navigation = [
    {
      name: "Practice Overview",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Patient Registry", href: "/doctor/patients", icon: Users },
    { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
    { name: "Consultations", href: "/doctor/messages", icon: MessageSquare },
    { name: "Profile & Settings", href: "/doctor/profile", icon: UserCog },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-100 bg-blue-900">
          <span className="text-xl font-extrabold text-white tracking-tight flex items-center">
            <Stethoscope className="mr-2 h-5 w-5" /> ImmunoAI MD
          </span>
        </div>

        <div className="p-4 space-y-2 mt-4">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Clinical Console
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${isActive(item.href) ? "text-white" : "text-gray-400 group-hover:text-blue-600"}`}
              />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-8">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-gray-500"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-end md:justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">
              {doctorName}
            </h1>{" "}
            {/* Dynamic Name */}
            <div className="flex items-center gap-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                Verified Specialist
              </span>
              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                {doctorName.charAt(4) || "D"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
