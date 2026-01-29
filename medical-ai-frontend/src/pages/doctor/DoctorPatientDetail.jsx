import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Activity,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Video,
  AlertTriangle,
  Save,
  Loader,
  Brain,
  ClipboardList,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const DoctorPatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCase = async () => {
      try {
        const response = await api.get(`/doctor/session/${id}/`);
        setSession(response.data);
        setDoctorNotes(response.data.doctor_notes || "");
      } catch (e) {
        alert("Failed to load case details.");
      } finally {
        setLoading(false);
      }
    };
    loadCase();
  }, [id]);

  const handleFinalize = async () => {
    if (!verificationStatus) {
      alert("Please select either 'Confirm' or 'Reject' before finalizing.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post(`/doctor/verify/${id}/`, {
        status: verificationStatus,
        notes: doctorNotes,
      });
      alert("Diagnosis finalized!");
      navigate("/doctor/patients");
    } catch (e) {
      alert("Failed to save.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center">
        <Loader className="animate-spin h-8 w-8 mx-auto text-blue-600" />
      </div>
    );
  if (!session) return <div className="p-20 text-center">Case not found</div>;

  // Helper for status color
  const getStatusColor = (val, highThreshold) =>
    val > highThreshold ? "text-red-600 font-bold" : "text-green-600";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/doctor/patients"
          className="flex items-center text-gray-500 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registry
        </Link>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-bold shadow-sm">
            <MessageSquare className="h-4 w-4 mr-2" /> Message
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm">
            <Video className="h-4 w-4 mr-2" /> Video Call
          </button>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {session.patient_name ? session.patient_name.charAt(0) : "P"}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.patient_name}
              </h1>
              <p className="text-gray-500">{session.patient_email}</p>{" "}
              {/* Shows Patient Email */}
              <p className="text-xs text-gray-400 mt-1">
                Session ID: #{session.id} •{" "}
                {new Date(session.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-sm">
            <div>
              <span className="block text-gray-500 text-xs uppercase">Age</span>{" "}
              <span className="font-bold">{session.clinical_data.age}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs uppercase">Sex</span>{" "}
              <span className="font-bold">
                {session.clinical_data.sex == "0" ? "Male" : "Female"}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs uppercase">
                Pain Score
              </span>{" "}
              <span className="font-bold">
                {session.clinical_data.pain_score}/10
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs uppercase">
                Disease Type
              </span>{" "}
              <span className="font-bold">{session.disease_type}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: AI & Clinical Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Result */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" /> AI Fusion
                Analysis
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${session.prediction_result.includes("Normal") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {session.confidence_score}% Confidence
              </span>
            </div>
            <div className="p-6">
              <div
                className={`border-l-4 p-4 mb-6 ${session.prediction_result.includes("Normal") ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}
              >
                <h4
                  className={`font-bold flex items-center ${session.prediction_result.includes("Normal") ? "text-green-900" : "text-red-900"}`}
                >
                  {session.prediction_result}
                </h4>
                <p className="text-sm mt-1 text-gray-700">
                  {session.ai_explanation_text}
                </p>
              </div>

              {/* Grad-CAM */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">
                  MRI Localization (Grad-CAM)
                </p>
                {session.grad_cam_url ? (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                    <img
                      src={`http://127.0.0.1:8000${session.grad_cam_url}`}
                      alt="MRI"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
                    No Imaging Data (PV Case or Not Uploaded)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reference Ranges Table (Original & Derived) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />{" "}
                Biomarker Analysis
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-3">Biomarker</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Raw Features */}
                  <tr>
                    <td className="px-6 py-3 font-medium">CSF Protein</td>
                    <td className="px-6 py-3">
                      {session.clinical_data.csf_protein} mg/dL
                    </td>
                    <td className="px-6 py-3 text-gray-500">15-45</td>
                    <td
                      className={`px-6 py-3 ${getStatusColor(session.clinical_data.csf_protein, 45)}`}
                    >
                      {session.clinical_data.csf_protein > 45
                        ? "High"
                        : "Normal"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium">CSF Cells</td>
                    <td className="px-6 py-3">
                      {session.clinical_data.csf_cells} /µL
                    </td>
                    <td className="px-6 py-3 text-gray-500">0-5</td>
                    <td
                      className={`px-6 py-3 ${getStatusColor(session.clinical_data.csf_cells, 5)}`}
                    >
                      {session.clinical_data.csf_cells > 5 ? "High" : "Normal"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium">Antibody Titer</td>
                    <td className="px-6 py-3">
                      1:{parseInt(session.clinical_data.antibody_titer)}
                    </td>
                    <td className="px-6 py-3 text-gray-500">&lt; 1:10</td>
                    <td
                      className={`px-6 py-3 ${getStatusColor(session.clinical_data.antibody_titer, 10)}`}
                    >
                      {session.clinical_data.antibody_titer > 10
                        ? "High"
                        : "Normal"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium">Dsg1 Index</td>
                    <td className="px-6 py-3">
                      {session.clinical_data.dsg1_index}
                    </td>
                    <td className="px-6 py-3 text-gray-500">&lt; 20</td>
                    <td
                      className={`px-6 py-3 ${getStatusColor(session.clinical_data.dsg1_index, 20)}`}
                    >
                      {session.clinical_data.dsg1_index > 20
                        ? "Positive"
                        : "Negative"}
                    </td>
                  </tr>

                  {/* Derived Features (Calculated by AI Engine) */}
                  <tr className="bg-blue-50/50">
                    <td className="px-6 py-3 font-medium text-blue-800">
                      CSF Ratio (Protein/Cells)
                    </td>
                    <td className="px-6 py-3 font-mono">
                      {parseFloat(session.clinical_data.csf_ratio).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-gray-500">Derived</td>
                    <td className="px-6 py-3 text-gray-500">-</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="px-6 py-3 font-medium text-blue-800">
                      Neuro Score
                    </td>
                    <td className="px-6 py-3 font-mono">
                      {session.clinical_data.neuro_score}
                    </td>
                    <td className="px-6 py-3 text-gray-500">Derived</td>
                    <td className="px-6 py-3 text-gray-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Verification */}
        <div className="space-y-6">
          <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2">Doctor Verification</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setVerificationStatus("verified")}
                className={`py-3 rounded-xl font-bold border-2 transition-all ${verificationStatus === "verified" ? "bg-green-500 border-green-500" : "border-white/20 hover:bg-white/10"}`}
              >
                <CheckCircle className="w-6 h-6 mx-auto mb-1" /> Confirm
              </button>
              <button
                onClick={() => setVerificationStatus("rejected")}
                className={`py-3 rounded-xl font-bold border-2 transition-all ${verificationStatus === "rejected" ? "bg-red-500 border-red-500" : "border-white/20 hover:bg-white/10"}`}
              >
                <XCircle className="w-6 h-6 mx-auto mb-1" /> Reject
              </button>
            </div>
            <textarea
              rows={4}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="w-full p-3 rounded-lg bg-blue-800 border-blue-700 text-white placeholder-blue-300 focus:outline-none"
              placeholder="Clinical notes..."
            ></textarea>
            <button
              onClick={handleFinalize}
              disabled={isSubmitting}
              className="w-full mt-6 bg-white text-blue-900 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Finalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientDetail;
