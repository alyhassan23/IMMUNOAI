import React, { useEffect, useState } from "react";
import {
  Video,
  MessageSquare,
  Star,
  Clock,
  MapPin,
  ArrowRight,
  Loader,
  Search,
  Filter,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllDoctors } from "../../services/api";

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchAllDoctors();
        setDoctors(data);
      } catch (e) {
        console.error("Failed to load doctors", e);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(term) ||
      doctor.spec.toLowerCase().includes(term) ||
      doctor.hospital.toLowerCase().includes(term)
    );
  });

  if (loading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader className="animate-spin text-blue-600 h-10 w-10" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Find a Specialist
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              Connect with top-rated doctors for personalized care.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="w-full md:w-[420px]">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by name, specialty, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 border border-gray-200 rounded-2xl w-full focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Results Section */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No specialists found
          </h3>
          <p className="text-gray-500 mt-1">
            We couldn't find any doctors matching "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <Link
              key={doctor.id}
              to={`/patient/doctors/${doctor.id}`}
              className="block group"
            >
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300 h-full flex flex-col relative">
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-blue-700 border border-blue-100 flex items-center shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified
                </div>

                <div className="p-6 flex-1">
                  <div className="flex items-start gap-5">
                    <div className="relative">
                      <img
                        src={doctor.img}
                        alt={doctor.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white"
                      />
                      <div
                        className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-lg border-2 border-white shadow-sm"
                        title="Online"
                      >
                        <Video className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-gray-900 text-xl truncate group-hover:text-blue-600 transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm mb-2 uppercase tracking-wide">
                        {doctor.spec}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-gray-400" />
                        <span className="truncate">{doctor.hospital}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                          <span className="ml-1.5 font-bold text-gray-900">
                            {doctor.rating}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs font-medium">
                          {doctor.reviews} Reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 mt-auto space-y-4">
                  <div className="h-px bg-gray-50" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      Next Available: Today
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium uppercase">
                        Consultation Fee
                      </p>
                      <span className="font-bold text-gray-900 text-lg">
                        {doctor.fee}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shadow-md shadow-gray-200 group-hover:shadow-blue-200">
                    Book Appointment{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDoctors;
