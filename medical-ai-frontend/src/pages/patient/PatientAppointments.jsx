import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  User,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "../../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/patient/appointments/");
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to load appointments", error);
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

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      await api.post("/appointment/cancel/", { appointment_id: id });
      fetchAppointments();
    } catch (e) {
      alert("Failed to cancel");
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) return alert("Please select date and time");
    const isoDateTime = `${newDate}T${newTime}:00`;
    try {
      await api.post("/appointment/reschedule/", {
        appointment_id: rescheduleId,
        new_date: isoDateTime,
      });
      setRescheduleId(null);
      setNewDate("");
      setNewTime("");
      fetchAppointments();
      alert("Rescheduled successfully!");
    } catch (e) {
      alert("Failed to reschedule");
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
            <Check className="w-3 h-3 mr-1" /> Completed
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
            <X className="w-3 h-3 mr-1" /> Cancelled
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
    // Diff in minutes
    const diffMins = (date.getTime() - now.getTime()) / (1000 * 60);

    // Allow joining 60 mins early (was 15) to fix timezone confusion issues during testing
    // And allow joining up to 2 hours late
    return diffMins <= 60 && diffMins >= -120;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500">
            Manage your consultations and video sessions.
          </p>
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

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading appointments...
          </div>
        ) : (activeTab === "upcoming" ? upcomingList : historyList).length ===
          0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">No appointments found.</p>
          </div>
        ) : (
          (activeTab === "upcoming" ? upcomingList : historyList).map((apt) => {
            const joinable = isJoinableLocally(apt);

            return (
              <div
                key={apt.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0 leading-none">
                    <span>{getDayNumber(apt)}</span>
                    <span className="text-[10px] font-normal uppercase">
                      {getMonthName(apt)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {apt.doctor_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {apt.specialization}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {getStatusBadge(apt.status)}
                      <span className="text-gray-500 text-xs flex items-center font-medium bg-gray-50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 mr-1" /> {apt.time}
                      </span>
                      <span className="text-gray-500 text-xs flex items-center font-medium bg-gray-50 px-2 py-1 rounded-md">
                        <Video className="w-3 h-3 mr-1" /> Video Call
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {apt.status === "upcoming" && (
                    <>
                      <button
                        onClick={() => setRescheduleId(apt.id)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      >
                        Reschedule
                      </button>

                      {joinable ? (
                        /* FIX: Changed /room/ to /video-call/ to match App.jsx routing */
                        <a
                          href={`/video-call/${apt.meet_link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/30 transition-all animate-pulse"
                        >
                          Join Call Now
                        </a>
                      ) : (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                  {/* If cancelled/missed/completed */}
                  {apt.status !== "upcoming" && (
                    <button className="px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                      Archived
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reschedule Appointment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  New Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setRescheduleId(null)}
                className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="flex-1 py-3 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
