import React, { useEffect, useState } from "react";
import { Calendar, Clock, Video, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPatientAppointments } from "../../services/api";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    // Fetch real appointments
    const loadData = async () => {
      try {
        const data = await fetchPatientAppointments();
        setAppointments(data);
      } catch (e) {
        console.log("No appointments found or backend error");
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
          <p className="text-gray-500 mt-1">
            Manage your consultations and video sessions.
          </p>
        </div>
        <Link
          to="/patient/doctors"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Book New
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "upcoming" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "past" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Past
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {appointments.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No appointments scheduled.</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="bg-blue-50 text-blue-700 px-5 py-3 rounded-xl text-center min-w-[90px]">
                  <span className="block text-xs font-bold uppercase tracking-wider">
                    {new Date(apt.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                  <span className="block text-2xl font-extrabold">
                    {new Date(apt.date).getDate()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {apt.doctor_name}
                  </h3>
                  <p className="text-sm text-gray-500">{apt.specialization}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> {apt.time}
                    </span>
                    <span className="flex items-center">
                      <Video className="w-4 h-4 mr-1" /> Video Consultation
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex gap-3">
                {/* Dynamic Join Link */}
                <Link
                  to={`/video-call/${apt.meet_link}`}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-center"
                >
                  Join Call
                </Link>
                <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">
                  Reschedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
