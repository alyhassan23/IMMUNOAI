import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Calendar,
  ArrowRight,
  FileText,
  Loader,
  Plus,
} from "lucide-react";
import { api } from "../../services/api";

const PatientDashboardHome = () => {
  const [userName, setUserName] = useState("Patient");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    if (name) setUserName(name);

    const loadStats = async () => {
      try {
        // Using the endpoint we created in views.py
        const response = await api.get("/patient/dashboard-stats/");
        setStats(response.data);
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            Good Morning, {userName}! 👋
          </h2>
          <p className="text-blue-100 max-w-xl">
            {stats?.recent_sessions?.length > 0
              ? "You have new AI analysis reports ready for review."
              : "Start your first AI diagnosis to detect early signs of AE or PV."}
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              to="/patient/diagnosis"
              className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Start New Diagnosis
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latest Report */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">
              Latest
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Last Prediction</h3>
          <p className="text-lg font-bold text-gray-900 mt-1 truncate">
            {stats?.recent_sessions[0]?.prediction_result || "No Data"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats?.recent_sessions[0]
              ? `${stats.recent_sessions[0].confidence_score}% Confidence`
              : "Run a test first"}
          </p>
        </div>

        {/* Next Appointment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">
            Next Appointment
          </h3>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {stats?.next_appointment?.date}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats?.next_appointment?.doctor}
          </p>
          <Link
            to="/patient/appointments"
            className="text-xs text-blue-600 font-bold mt-2 block hover:underline"
          >
            Manage
          </Link>
        </div>

        {/* Total Reports */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Reports</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats?.total_reports}
          </p>
          <Link
            to="/patient/history"
            className="text-xs text-blue-600 font-bold mt-1 block hover:underline"
          >
            View Archive
          </Link>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Recent Analysis History
          </h3>
          <Link
            to="/patient/history"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {stats?.recent_sessions?.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border ${session.disease_type === "AE" ? "bg-blue-100 border-blue-200 text-blue-700" : "bg-purple-100 border-purple-200 text-purple-700"}`}
                >
                  <span className="text-xs font-bold">
                    {session.disease_type}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {session.disease_type === "AE"
                      ? "Encephalitis Screen"
                      : "Pemphigus Screen"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Result:{" "}
                    <span
                      className={
                        session.prediction_result.includes("Normal")
                          ? "text-green-600"
                          : "text-red-600 font-bold"
                      }
                    >
                      {session.prediction_result}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-sm text-gray-600 font-medium">
                  {new Date(session.created_at).toLocaleDateString()}
                </span>
                <Link
                  to="/patient/results"
                  state={{ result: session }} // Pass data to results page
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  View Report
                </Link>
              </div>
            </div>
          ))}
          {(!stats?.recent_sessions || stats.recent_sessions.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No analysis history found.</p>
              <Link
                to="/patient/diagnosis"
                className="text-blue-600 font-bold hover:underline"
              >
                Start your first analysis
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardHome;
