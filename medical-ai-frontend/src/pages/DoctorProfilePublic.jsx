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
  Calendar,
  ArrowRight,
  Loader,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { fetchDoctorDetail } from "../services/api";

const DoctorProfilePublic = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const data = await fetchDoctorDetail(id);
        setDoctor(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={doctor.img || "https://via.placeholder.com/150"}
                  alt={doctor.name}
                  className="w-40 h-40 md:w-56 md:h-56 rounded-2xl object-cover shadow-lg"
                />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                {doctor.name}
              </h1>
              <p className="text-blue-600 font-bold text-xl mt-1">
                {doctor.role}
              </p>

              <div className="mt-4 space-y-2 text-gray-600">
                <p className="flex items-center">
                  <Building className="w-4 h-4 mr-2" /> {doctor.hospital}
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> {doctor.location}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8 border-t border-gray-100 pt-6">
                <div>
                  <p className="text-2xl font-bold">{doctor.experience}+</p>
                  <p className="text-xs uppercase text-gray-500">Years</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{doctor.patients}</p>
                  <p className="text-xs uppercase text-gray-500">Patients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{doctor.successRate}</p>
                  <p className="text-xs uppercase text-gray-500">Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {doctor.about || "No biography provided."}
              </p>
            </div>
          </div>

          {/* Right Col: Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Consultation
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fee</span>
                  <span className="text-2xl font-extrabold text-blue-600">
                    {doctor.fee}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* BUTTON 1: BOOK APPOINTMENT */}
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                >
                  <Video className="w-5 h-5 mr-2" /> Book Video Call
                </Link>

                {/* BUTTON 2: CHAT */}
                <Link
                  to="/patient/messages"
                  className="flex items-center justify-center w-full bg-white text-blue-600 border-2 border-blue-100 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 mr-2" /> Chat with Doctor
                </Link>

                <p className="text-xs text-center text-gray-400">
                  Please login to access these features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfilePublic;
