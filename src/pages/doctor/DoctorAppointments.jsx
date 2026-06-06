import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  Loader,
  XCircle,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/doctor/appointments/");
      setAppointments(response.data);
    } catch (e) {
      console.error("Failed to load appointments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(
      () => setAppointments((prev) => [...prev]),
      60000,
    );
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action, id) => {
    try {
      if (action === "cancel") {
        if (!window.confirm("Cancel this appointment?")) return;
        await api.post("/appointment/cancel/", { appointment_id: id });
      } else if (action === "complete") {
        await api.post("/appointment/complete/", { appointment_id: id });
      }
      fetchAppointments();
    } catch (e) {
      alert("Action failed.");
    }
  };

  const upcomingList = appointments.filter((apt) => apt.status === "upcoming");
  const historyList = appointments.filter((apt) => apt.status !== "upcoming");

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </span>
        );
      case "missed":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" /> Missed
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // --- ROBUST DATE PARSING HELPER ---
  const getValidDate = (apt) => {
    // 1. Try ISO Raw Date
    if (apt.raw_date) return new Date(apt.raw_date);

    // 2. Try combining Date + Time strings
    if (apt.date && apt.time) {
      const combined = new Date(`${apt.date} ${apt.time}`);
      if (!isNaN(combined.getTime())) return combined;
    }

    // 3. Try just Date
    if (apt.date) {
      const d = new Date(apt.date);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  const getDayNumber = (apt) => {
    const date = getValidDate(apt);
    return date ? date.getDate() : "--";
  };

  const getMonthName = (apt) => {
    const date = getValidDate(apt);
    return date ? date.toLocaleString("default", { month: "short" }) : "N/A";
  };

  const isJoinableLocally = (apt) => {
    const date = getValidDate(apt);
    if (!date) return false;

    const now = new Date();
    const diffMins = (date.getTime() - now.getTime()) / (1000 * 60);

    // Join if: 60 mins before OR up to 120 mins after start (Doctor window)
    return diffMins <= 60 && diffMins >= -120;
  };

  // Helper to ensure consistent Room ID
  const getRoomLink = (apt) => {
    // Prefer the database link, but fallback to a deterministic ID based on Appointment ID
    // This ensures that even if 'meet_link' is missing in old data, both users join "appointment-123"
    const roomId = apt.meet_link
      ? apt.meet_link.trim()
      : `appointment-${apt.id}`;
    return `/video-call/${roomId}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Consultation Schedule
          </h2>
          <p className="text-gray-500">Manage your patient appointments.</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "upcoming" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Upcoming ({upcomingList.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "history" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader className="animate-spin text-blue-600 h-8 w-8" />
          </div>
        ) : (activeTab === "upcoming" ? upcomingList : historyList).length ===
          0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            No appointments found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(activeTab === "upcoming" ? upcomingList : historyList).map(
              (apt) => {
                const joinable = isJoinableLocally(apt);

                return (
                  <div
                    key={apt.id}
                    className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="bg-blue-50 text-blue-600 px-4 py-3 rounded-xl text-center min-w-[80px] border border-blue-100">
                        <span className="block text-xs font-bold uppercase tracking-wider">
                          {getMonthName(apt)}
                        </span>
                        <span className="block text-xl font-extrabold">
                          {getDayNumber(apt)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg flex items-center">
                          <User className="w-5 h-5 mr-2 text-gray-400" />
                          {apt.patient_name || "Unknown Patient"}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1 gap-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" /> {apt.time}
                          </span>
                          <span className="flex items-center">
                            <Video className="w-4 h-4 mr-1" /> Online Consult
                          </span>
                        </div>
                        <div className="mt-2">{getStatusBadge(apt.status)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                      {apt.status === "upcoming" && (
                        <>
                          <button
                            onClick={() => handleAction("cancel", apt.id)}
                            className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>

                          {joinable ? (
                            <>
                              {/* Updated Link logic to ensure consistency */}
                              <a
                                href={getRoomLink(apt)}
                                target="_blank"
                                rel="noreferrer"
                                className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm shadow-sm flex items-center animate-pulse"
                              >
                                <Video className="w-4 h-4 mr-2" /> Start Call
                              </a>
                              <button
                                onClick={() => handleAction("complete", apt.id)}
                                className="px-4 py-2 text-sm font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-green-200"
                              >
                                Mark Done
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs italic bg-gray-100 px-3 py-1 rounded-full">
                              Link active 15 mins before
                            </span>
                          )}
                        </>
                      )}
                      {apt.status === "completed" && (
                        <span className="text-green-600 font-bold text-sm flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
