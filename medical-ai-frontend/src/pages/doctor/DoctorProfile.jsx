import React, { useState, useEffect } from "react";
import { Save, Loader, CheckCircle, Stethoscope } from "lucide-react";
import { getProfile, updateProfile } from "../../services/api";

const DoctorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    specialization: "",
    hospital: "",
    experience: 0,
    fee: 50,
    bio: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProfile();
        setFormData((prev) => ({ ...prev, ...data }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setSuccessMsg("Professional profile updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center">
        <Loader className="animate-spin h-8 w-8 mx-auto text-blue-600" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <p className="text-gray-500">
            Update your professional credentials displayed to patients.
          </p>
        </div>
        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center text-sm font-bold">
            <CheckCircle className="w-4 h-4 mr-2" /> {successMsg}
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Professional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="Neurology">Neurology</option>
                <option value="Immunology">Immunology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General Practice">General Practice</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital / Clinic
              </label>
              <input
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <input
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fee ($)
              </label>
              <input
                name="fee"
                type="number"
                value={formData.fee}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Describe your expertise..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {saving ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
