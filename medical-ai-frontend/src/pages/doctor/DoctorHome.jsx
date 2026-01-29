import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Video,
  Clock,
  ArrowRight,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const DoctorHome = () => {
  const [name, setName] = useState("Doctor");
  const [stats, setStats] = useState({
    patients: 0,
    revenue: "$0",
    consults: 0,
    pending: 0,
  });

  useEffect(() => {
    const storedName = localStorage.getItem("user_name") || "";
    setName(storedName);

    // --- SMART DUMMY DATA ---
    const lowerName = storedName.toLowerCase();
    if (lowerName.includes("fahad")) {
      setStats({
        patients: 1542,
        revenue: "$14,250",
        consults: 128,
        pending: 5,
      });
    } else if (
      lowerName.includes("hassnain") ||
      lowerName.includes("hasnain")
    ) {
      setStats({ patients: 982, revenue: "$10,800", consults: 94, pending: 3 });
    } else {
      setStats({ patients: 12, revenue: "$600", consults: 4, pending: 1 });
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Practice Overview
          </h2>
          <p className="text-gray-500 mt-1">Welcome back, Dr. {name}.</p>
        </div>
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Patients</p>
          <h3 className="text-3xl font-extrabold text-gray-900">
            {stats.patients}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
          <h3 className="text-3xl font-extrabold text-gray-900">
            {stats.revenue}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Video className="h-6 w-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Consultations</p>
          <h3 className="text-3xl font-extrabold text-gray-900">
            {stats.consults}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Action
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Pending Reviews</p>
          <h3 className="text-3xl font-extrabold text-gray-900">
            {stats.pending}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Today's Schedule
            </h3>
            <Link
              to="/doctor/appointments"
              className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center"
            >
              View Calendar <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {/* Mock Schedule */}
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <span className="font-mono text-sm font-bold text-gray-500 w-20">
                09:00 AM
              </span>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Alice Tester</p>
                <p className="text-xs text-gray-500">Video Follow-up</p>
              </div>
              <span className="bg-white border px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                Upcoming
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-green-800 text-sm">
              <span className="flex items-center">
                <Activity className="w-4 h-4 mr-2" /> AI Engine
              </span>
              <span className="font-bold">Online</span>
            </div>
          </div>
          <Link
            to="/doctor/patients"
            className="mt-6 block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Go to Patient Registry
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
