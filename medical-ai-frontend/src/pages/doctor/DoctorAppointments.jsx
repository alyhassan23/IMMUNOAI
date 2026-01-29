import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MoreHorizontal,
  User,
  CheckCircle,
  Loader,
} from "lucide-react";
import { fetchDoctorAppointments } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDoctorAppointments();
        setAppointments(data);
      } catch (e) {
        console.error("Failed to load appointments", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const joinCall = (roomId) => {
    if (!roomId) {
      alert("Error: No video link available for this appointment.");
      return;
    }
    navigate(`/video-call/${roomId}`);
  };

  if (loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-500">Manage your consultation schedule.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900">Upcoming Schedule</h3>
        </div>

        {appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            No appointments booked yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="bg-blue-100 text-blue-700 px-4 py-3 rounded-xl text-center min-w-[80px] border border-blue-200">
                    <span className="block text-xs font-bold uppercase tracking-wider">
                      {apt.date
                        ? new Date(apt.date).toLocaleString("default", {
                            month: "short",
                          })
                        : "N/A"}
                    </span>
                    <span className="block text-xl font-extrabold">
                      {apt.date ? new Date(apt.date).getDate() : "--"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg flex items-center">
                      {apt.patient_name || "Unknown Patient"}
                      <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Patient #{apt.patient_id}
                      </span>
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 mr-1" /> {apt.time || "--:--"}
                      <span className="mx-2">•</span>
                      <Video className="w-4 h-4 mr-1" /> Video Consultation
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                      apt.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {apt.status === "confirmed" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : null}
                    {apt.status ? apt.status.toUpperCase() : "PENDING"}
                  </span>
                  <button
                    onClick={() => joinCall(apt.meet_link)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm shadow-sm transition-colors flex items-center"
                  >
                    <Video className="w-4 h-4 mr-2" /> Start Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
