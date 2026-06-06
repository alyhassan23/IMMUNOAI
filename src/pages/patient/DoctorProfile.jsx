import React, { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  Award,
  GraduationCap,
  Building,
  Video,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Shield,
  Loader,
  ArrowRight,
  Clock,
  CreditCard,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchDoctorDetail } from "../../services/api";
import BookingModal from "../../pages/patient/BookingModal";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const data = await fetchDoctorDetail(id);
        setDoctor(data);
      } catch (e) {
        console.error("Failed to load doctor", e);
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, [id]);

  // Helper to get initials (e.g. "Dr. John Smith" -> "JS" or "DS" depending on logic,
  // here we simply take the first letter of the first and last word to be safe)
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );

  if (!doctor)
    return (
      <div className="p-20 text-center text-gray-500">Doctor not found.</div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link
            to="/patient/doctors"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors group"
          >
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 mr-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Specialists
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white overflow-hidden relative">
          {/* Decorative Background Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image / Initials - Overlapping Banner */}
              <div className="flex-shrink-0 -mt-16">
                <div className="relative">
                  {/* REPLACED IMG WITH INITIALS DIV */}
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-lg border-[6px] border-white bg-[#0ea5e9] flex items-center justify-center">
                    <span className="text-white text-4xl md:text-5xl font-medium tracking-wide">
                      {getInitials(doctor.name)}
                    </span>
                  </div>

                  <div className="absolute bottom-2 -right-2 bg-blue-600 text-white px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border-4 border-white">
                    <Shield className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 pt-4 md:pt-6 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      {doctor.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-blue-600 font-semibold text-lg bg-blue-50 px-3 py-0.5 rounded-lg">
                        {doctor.role}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.hospital}
                      </div>
                      <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <div className="ml-2 text-right">
                        <div className="font-bold text-gray-900 leading-none">
                          {doctor.rating}
                        </div>
                        <div className="text-xs text-yellow-700 font-medium">
                          {doctor.reviews} Reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
              {[
                {
                  label: "Experience",
                  value: `${doctor.experience}+ Years`,
                  icon: Award,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: "Patients",
                  value: doctor.patients,
                  icon: Stethoscope,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Success Rate",
                  value: doctor.successRate,
                  icon: CheckCircle,
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: "Availability",
                  value: "Mon - Fri",
                  icon: Clock,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mr-3`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-blue-500 bg-blue-100 p-1 rounded-lg" />
                About {doctor.name}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                {doctor.about}
              </p>

              {doctor.specialties && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium shadow-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Credentials Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-blue-500 bg-blue-100 p-1 rounded-lg" />
                Education & Credentials
              </h2>

              <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                {doctor.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-sm" />
                    <h3 className="font-bold text-gray-900 text-lg">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 font-medium">{edu.school}</p>
                    <span className="text-xs text-gray-400 font-semibold bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">
                      Class of {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/10 border border-blue-100 p-6 overflow-hidden relative">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0" />

                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Book Appointment
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Available slots for today
                    </p>
                  </div>

                  <div className="flex justify-between items-end mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                        Consultation Fee
                      </p>
                      <div className="flex items-center text-green-600 text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" /> Best Price
                      </div>
                    </div>
                    <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                      {doctor.fee}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowBooking(true)}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center group"
                    >
                      <Video className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                      Video Consultation
                    </button>

                    <Link
                      to="/patient/messages"
                      className="w-full bg-white text-gray-700 border-2 border-gray-100 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-blue-100 hover:text-blue-600 transition-all flex items-center justify-center active:scale-[0.98]"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat Message
                    </Link>
                  </div>

                  <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Secure Payment &
                    Verified Doctor
                  </p>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <h4 className="font-bold text-lg mb-2 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" /> Insurance
                </h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Dr. Smith accepts most major insurance plans including
                  BlueCross, Aetna, and Medicare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Booking Modal */}
      {showBooking && (
        <BookingModal
          doctor={doctor}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            alert("Appointment Booked!");
            setShowBooking(false);
          }}
        />
      )}
    </div>
  );
};

export default DoctorProfile;
