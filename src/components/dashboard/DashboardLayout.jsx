import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  User,
  Stethoscope,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  Bell,
  BookOpen,
  Calendar,
} from "lucide-react";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "Loading...", id: "..." });

  // Load User Data on Mount
  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const id = localStorage.getItem("user_id");
    const role = localStorage.getItem("user_role");

    if (!name) {
      navigate("/login"); // Force login if no session
    } else {
      setUserData({ name: name || "Patient", id: id || "0000" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navigation = [
    { name: "Overview", href: "/patient/dashboard", icon: LayoutDashboard },
    { name: "AI Diagnosis", href: "/patient/diagnosis", icon: Activity },
    { name: "Analysis History", href: "/patient/history", icon: FileText }, // Updated
    { name: "My Appointments", href: "/patient/appointments", icon: Calendar }, // Updated
    { name: "Treatment Guide", href: "/patient/treatment", icon: BookOpen },
    { name: "Find Doctors", href: "/patient/doctors", icon: Stethoscope },
    { name: "Messages", href: "/patient/messages", icon: MessageSquare },
    { name: "My Profile", href: "/patient/profile", icon: User },
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

      {/* Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-100">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
            ImmunoAI
          </span>
        </div>

        <div className="p-4 space-y-2 mt-4">
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
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Dynamic User Name */}
        <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-8">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-gray-500"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-end md:justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">
              Patient Portal
            </h1>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors relative">
                <Bell className="h-6 w-6" />
                {/* Optional notification dot */}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {userData.name.charAt(0)}
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-700">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Patient ID: #{userData.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
