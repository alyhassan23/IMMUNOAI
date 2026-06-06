import React, { useEffect, useState } from "react";
import {
  Linkedin,
  Twitter,
  Mail,
  Search,
  Filter,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllDoctors } from "../../services/api";

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Mock Categories for Filter
  const categories = [
    "All",
    "Neurologist",
    "Dermatologist",
    "Immunologist",
    "Radiologist",
  ];

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchAllDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (e) {
        console.error("Failed to load doctors", e);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  // Handle Search & Filter
  useEffect(() => {
    let result = doctors;

    if (activeFilter !== "All") {
      result = result.filter((doc) => doc.spec.includes(activeFilter));
    }

    if (searchTerm) {
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.spec.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredDoctors(result);
  }, [searchTerm, activeFilter, doctors]);

  // Skeleton Loader Component
  const DoctorSkeleton = () => (
    <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse">
      <div className="h-64 bg-gray-200 rounded-2xl mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
      <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent z-0"></div>
      <div className="absolute top-20 right-0 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        {/* --- Header Section --- */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
            World Class Care
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Meet the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Medical Board
            </span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Our multidisciplinary team of specialists collaborates to provide
            precise diagnosis and personalized treatment plans for rare
            autoimmune disorders.
          </p>
        </div>

        {/* --- Controls Bar (Search & Filter) --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-sm sticky top-24 z-30">
          {/* Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeFilter === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* --- Grid Section --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <DoctorSkeleton key={n} />
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No specialists found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("All");
              }}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden m-3 rounded-[1.5rem] bg-gray-100">
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Floating Specialty Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                    <Stethoscope size={12} className="text-blue-500" />
                    {doctor.spec}
                  </div>

                  {/* Social Overlay (Slides up on hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-blue-500 hover:text-white transition-colors">
                      <Linkedin size={18} />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-sky-400 hover:text-white transition-colors">
                      <Twitter size={18} />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors">
                      <Mail size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-2 text-center flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-xl mb-1 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {doctor.hospital ||
                      "Leading specialist in autoimmune diagnostics and patient care."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <Link
                      to={`/patient/doctors/${doctor.id}`}
                      className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20"
                    >
                      View Profile <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDoctors;
