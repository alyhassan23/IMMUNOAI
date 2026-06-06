import React, { useState } from "react";
import { X, Calendar, Clock, Loader, CheckCircle } from "lucide-react";
import { api } from "../../services/api";

const BookingModal = ({ doctor, onClose, onSuccess }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) return alert("Please select date and time");

    setLoading(true);
    // Combine date and time into ISO string
    const dateTime = new Date(`${date}T${time}`).toISOString();

    try {
      await api.post("/patient/book-appointment/", {
        doctor_id: doctor.id,
        date_time: dateTime,
      });
      onSuccess();
      onClose();
    } catch (error) {
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Book Consultation</h3>
            <p className="text-blue-100 text-sm mt-1">with {doctor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="time"
                className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">
                Secure Video Link
              </p>
              <p className="text-xs text-blue-600 mt-1">
                A unique video room will be generated automatically for this
                session.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center"
          >
            {loading ? <Loader className="animate-spin" /> : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
