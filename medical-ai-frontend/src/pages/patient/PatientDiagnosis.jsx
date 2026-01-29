import React, { useState } from "react";
import { UploadCloud, Activity, ArrowRight, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { submitDiagnosis } from "../../services/api";

const PatientDiagnosis = () => {
  const [step, setStep] = useState(1);
  const [diseaseType, setDiseaseType] = useState("AE");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Unified State
  const [clinicalData, setClinicalData] = useState({
    age: "",
    sex: "0",

    // Neuro (AE)
    seizures: "0",
    memory_loss: "0",
    psychiatric_symptoms: "0",

    // Skin (PV) - ENSURE THESE ARE SENT
    skin_blisters: "0",
    mucosal_ulcers: "0",
    pain_score: 5,

    // Labs
    csf_protein: "",
    csf_cells: "",
    antibody_titer: "",
    dsg1_index: "",
    dsg3_index: "",

    // Imaging/Status
    mri_abnormal: "0",
    eeg_abnormal: "0",
    tumor_status: "0",
    infection_status: "0",
  });

  const [mriFile, setMriFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMriFile(e.target.files[0]);
      // Auto-set mri_abnormal for AE
      setClinicalData((prev) => ({ ...prev, mri_abnormal: "1" }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("disease_type", diseaseType);

    // Convert state values to numbers before sending
    const processedData = {};
    for (const key in clinicalData) {
      processedData[key] = Number(clinicalData[key]);
    }

    formData.append("clinical_data", JSON.stringify(processedData));

    if (mriFile) {
      formData.append("mri_scan", mriFile);
    }

    try {
      const result = await submitDiagnosis(formData);
      navigate("/patient/results", { state: { result: result.data } });
    } catch (error) {
      alert("Error running diagnosis. Check inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Advanced Diagnostic Session
        </h2>
        <p className="text-gray-500 mt-2">
          Powered by <strong>Stacking Ensemble (Accuracy: 81.3%)</strong> &
          Multimodal Fusion.
        </p>
      </div>

      {/* Disease Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setDiseaseType("AE")}
          className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
            diseaseType === "AE"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          Autoimmune Encephalitis (AE)
        </button>
        <button
          onClick={() => setDiseaseType("PV")}
          className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
            diseaseType === "PV"
              ? "border-purple-600 bg-purple-50 text-purple-700"
              : "border-gray-200 hover:border-purple-300"
          }`}
        >
          Pemphigus Vulgaris (PV)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
              Step 1: Clinical & Lab Data
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Common */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex
                </label>
                <select
                  name="sex"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pain Score (0-10)
                </label>
                <input
                  type="number"
                  name="pain_score"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* AE Fields */}
              {diseaseType === "AE" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CSF Protein
                    </label>
                    <input
                      type="number"
                      name="csf_protein"
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CSF Cells
                    </label>
                    <input
                      type="number"
                      name="csf_cells"
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Antibody Titer
                    </label>
                    <input
                      type="number"
                      name="antibody_titer"
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {/* PV Fields (NEWLY ADDED VISIBILITY) */}
              {diseaseType === "PV" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dsg1 Index
                    </label>
                    <input
                      type="number"
                      name="dsg1_index"
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dsg3 Index
                    </label>
                    <input
                      type="number"
                      name="dsg3_index"
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              {diseaseType === "AE" && (
                <div>
                  <span className="block text-sm font-bold text-blue-600 mb-2">
                    Neurological Symptoms
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setClinicalData({
                            ...clinicalData,
                            seizures: e.target.checked ? "1" : "0",
                          })
                        }
                      />
                      <span>Seizures</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setClinicalData({
                            ...clinicalData,
                            memory_loss: e.target.checked ? "1" : "0",
                          })
                        }
                      />
                      <span>Memory Loss</span>
                    </label>
                  </div>
                </div>
              )}

              {diseaseType === "PV" && (
                <div>
                  <span className="block text-sm font-bold text-purple-600 mb-2">
                    Dermatological Symptoms
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setClinicalData({
                            ...clinicalData,
                            skin_blisters: e.target.checked ? "1" : "0",
                          })
                        }
                      />
                      <span>Skin Blisters</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setClinicalData({
                            ...clinicalData,
                            mucosal_ulcers: e.target.checked ? "1" : "0",
                          })
                        }
                      />
                      <span>Mucosal Ulcers</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
              Step 2: Imaging Upload
            </h3>

            {diseaseType === "AE" ? (
              <div className="border-2 border-dashed border-gray-300 p-10 text-center rounded-xl">
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  Upload MRI (DICOM/JPG) - Required for Fusion
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-4"
                />
              </div>
            ) : (
              <div className="p-10 text-center rounded-xl bg-purple-50 border border-purple-100">
                <Activity className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-700 font-bold">
                  No Imaging Required for PV
                </p>
                <p className="text-sm text-purple-600">
                  Model uses tabular biomarkers only.
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-gray-500 font-bold"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700"
              >
                {isLoading ? "Processing..." : "Run Analysis"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDiagnosis;
