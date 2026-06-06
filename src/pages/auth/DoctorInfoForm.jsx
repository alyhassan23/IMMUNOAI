import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Building,
  Award,
  FileText,
  ArrowRight,
  Loader,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { api } from "../../services/api";

const DoctorInfoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    specialization: "Neurology",
    hospital: "",
    license_id: "",
    experience: "",
    bio: "",
    fee: "50",
    education: "", // Stored as comma-sep string for now
    awards: "", // Stored as comma-sep string for now
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/update-doctor/", {
        email: email,
        ...formData,
      });

      alert("Profile setup complete! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Failed to save details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700">Access Denied</h2>
          <p className="text-gray-500 mb-4">
            Please register to set up your profile.
          </p>
          <button
            onClick={() => navigate("/register-doctor")}
            className="text-blue-600 font-bold hover:underline"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-3xl w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-gray-600">
              Join the ImmunoAI network as a verified specialist.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Professional Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                Professional Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Neurology">Neurology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Practice">General Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Medical License ID
                  </label>
                  <input
                    name="license_id"
                    required
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="LIC-XXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Work & Fee */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                Practice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Current Hospital / Clinic
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      name="hospital"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Mayo Hospital"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Experience (Yrs)
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      name="experience"
                      type="number"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Consultation Fee ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      name="fee"
                      type="number"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Bio & Education */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                Biography & Education
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Education (Comma separated)
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      name="education"
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="MBBS - King Edward, FCPS - CPSP"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <textarea
                      name="bio"
                      rows={4}
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Briefly describe your expertise, research interests, and patient care philosophy..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Save Profile & Continue{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoForm;
