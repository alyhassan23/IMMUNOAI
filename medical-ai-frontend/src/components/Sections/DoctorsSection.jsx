import React, { useEffect, useState } from "react";
import { Loader, Linkedin, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllDoctors } from "../../services/api";

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section from Image */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">
            OUR TEAM
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            Meet the Medical Board
          </h2>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search specialists..."
            className="p-3 border border-gray-200 rounded-xl w-full md:w-96 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>

        {doctors.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            No doctors found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col items-center"
              >
                {/* Profile Image - Full Width Top */}
                <div className="w-full h-64 overflow-hidden px-4 pt-4">
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Content - Centered as per image */}
                <div className="p-6 text-center flex-1">
                  <h3 className="font-bold text-gray-900 text-xl mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-semibold mb-4 uppercase tracking-tight">
                    {doctor.spec}
                  </p>

                  {/* Doctor Bio (Mapping to 'hospital' or 'rating' logic if needed) */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {doctor.hospital ||
                      "Expert in clinical diagnostics and advanced autoimmune research."}
                  </p>

                  {/* Social Icons from Image */}
                  <div className="flex justify-center gap-5 text-gray-400">
                    <Linkedin className="w-5 h-5 cursor-pointer hover:text-blue-700 transition-colors" />
                    <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
                    <Mail className="w-5 h-5 cursor-pointer hover:text-red-400 transition-colors" />
                  </div>
                </div>

                {/* Profile Link */}
                <Link
                  to={`/patient/doctors/${doctor.id}`}
                  className="w-full py-4 bg-gray-50 border-t border-gray-100 text-gray-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors text-center"
                >
                  View Full Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDoctors;
