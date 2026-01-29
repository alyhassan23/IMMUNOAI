import React from "react";
import {
  Download,
  Share2,
  AlertTriangle,
  Activity,
  CheckCircle,
  Info,
  Brain,
  ClipboardList,
} from "lucide-react";
import { Link, useLocation, Navigate } from "react-router-dom";

const PatientResults = () => {
  const location = useLocation();
  const resultData = location.state?.result;

  if (!resultData) {
    return <Navigate to="/patient/diagnosis" replace />;
  }

  // Backend Data
  const result = resultData.prediction_result || resultData.result;
  const confidence = resultData.confidence_score || resultData.confidence;
  const explanation = resultData.ai_explanation_text || resultData.explanation;
  const grad_cam_url = resultData.grad_cam_url || resultData.grad_cam;
  const shap_features = resultData.shap_features || [];

  // RAW CLINICAL DATA
  const clinical = resultData.clinical_data || {};

  // Determine Disease Type from Result String or Data
  const isAE = result?.includes("AE") || resultData.disease_type === "AE";
  const isPV = result?.includes("PV") || resultData.disease_type === "PV";

  const isPositive =
    result && !result.includes("Normal") && result !== "Analysis Failed";
  const themeColor = isAE ? "red" : isPV ? "purple" : "green";

  const colorClasses = {
    bg: isPositive ? `bg-${themeColor}-50` : "bg-green-50",
    border: isPositive ? `border-${themeColor}-100` : "border-green-100",
    text: isPositive ? `text-${themeColor}-900` : "text-green-900",
    icon: isPositive ? `text-${themeColor}-600` : "text-green-600",
    bar: isPositive ? `bg-${themeColor}-500` : "bg-green-500",
  };

  // Helper to determine status and style
  const getStatus = (value, type, threshold) => {
    if (value === undefined || value === null)
      return { text: "N/A", className: "text-gray-400" };
    const val = parseFloat(value);

    if (type === "binary") {
      return val === 1
        ? { text: "Present", className: "text-red-600 font-bold" }
        : { text: "Normal", className: "text-green-600" };
    }
    if (type === "range_high") {
      return val > threshold
        ? { text: "High / Abnormal", className: "text-red-600 font-bold" }
        : { text: "Normal", className: "text-green-600" };
    }
    if (type === "range_low") {
      return val < threshold
        ? { text: "Abnormal", className: "text-red-600 font-bold" }
        : { text: "Normal", className: "text-green-600" };
    }
    return { text: "Normal", className: "text-green-600" };
  };

  // Define ALL indicators with a 'category' tag
  const allIndicators = [
    // Common
    {
      label: "Age",
      value: clinical.age,
      unit: "Years",
      range: "N/A",
      status: { text: "Normal", className: "text-green-600" },
      category: "common",
    },
    {
      label: "Pain Score",
      value: clinical.pain_score,
      unit: "",
      range: "0 - 3",
      ...getStatus(clinical.pain_score, "range_high", 3),
      category: "common",
    },

    // AE Specific
    {
      label: "Seizures",
      value: clinical.seizures,
      unit: "",
      range: "0 (Absent)",
      ...getStatus(clinical.seizures, "binary"),
      category: "AE",
    },
    {
      label: "Memory Loss",
      value: clinical.memory_loss,
      unit: "",
      range: "0 (Absent)",
      ...getStatus(clinical.memory_loss, "binary"),
      category: "AE",
    },
    {
      label: "CSF Protein",
      value: clinical.csf_protein,
      unit: "mg/dL",
      range: "15 - 45",
      ...getStatus(clinical.csf_protein, "range_high", 45),
      category: "AE",
    },
    {
      label: "CSF Cells",
      value: clinical.csf_cells,
      unit: "/µL",
      range: "0 - 5",
      ...getStatus(clinical.csf_cells, "range_high", 5),
      category: "AE",
    },
    {
      label: "Antibody Titer",
      value: clinical.antibody_titer,
      unit: "",
      range: "< 1:10",
      ...getStatus(clinical.antibody_titer, "range_high", 10),
      category: "AE",
    },
    {
      label: "Neuro Score",
      value: clinical.neuro_score,
      unit: "",
      range: "0",
      ...getStatus(clinical.neuro_score, "range_high", 0),
      category: "AE",
    },
    {
      label: "CSF Ratio",
      value: clinical.csf_ratio
        ? parseFloat(clinical.csf_ratio).toFixed(2)
        : "0",
      unit: "",
      range: "> 2.0",
      ...getStatus(clinical.csf_ratio, "range_low", 2.0),
      category: "AE",
    },
    {
      label: "Imaging Score",
      value: clinical.imaging_score,
      unit: "",
      range: "0",
      ...getStatus(clinical.imaging_score, "range_high", 0),
      category: "AE",
    },

    // PV Specific
    {
      label: "Skin Blisters",
      value: clinical.skin_blisters,
      unit: "",
      range: "0 (Absent)",
      ...getStatus(clinical.skin_blisters, "binary"),
      category: "PV",
    },
    {
      label: "Mucosal Ulcers",
      value: clinical.mucosal_ulcers,
      unit: "",
      range: "0 (Absent)",
      ...getStatus(clinical.mucosal_ulcers, "binary"),
      category: "PV",
    },
    {
      label: "Dsg1 Index",
      value: clinical.dsg1_index,
      unit: "U/mL",
      range: "< 20",
      ...getStatus(clinical.dsg1_index, "range_high", 20),
      category: "PV",
    },
    {
      label: "Dsg3 Index",
      value: clinical.dsg3_index,
      unit: "U/mL",
      range: "< 20",
      ...getStatus(clinical.dsg3_index, "range_high", 20),
      category: "PV",
    },
    {
      label: "Skin Score",
      value: clinical.skin_score,
      unit: "",
      range: "0",
      ...getStatus(clinical.skin_score, "range_high", 0),
      category: "PV",
    },
  ];

  // FILTER LOGIC
  const displayedIndicators = allIndicators.filter((item) => {
    if (item.category === "common") return true;
    if (isAE && item.category === "AE") return true;
    if (isPV && item.category === "PV") return true;
    // If result is Normal, we look at what was tested (based on available non-zero data or session type)
    // Assuming session.disease_type is passed. If not, infer from data presence.
    if (!isAE && !isPV) {
      // Fallback: If disease_type was AE, show AE fields.
      if (resultData.disease_type === "AE" && item.category === "AE")
        return true;
      if (resultData.disease_type === "PV" && item.category === "PV")
        return true;
    }
    return false;
  });

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/report/pdf/${resultData.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ImmunoAI_Report_${resultData.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert("Failed to generate PDF.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <div className="flex gap-2 mt-1">
            <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              Model: Hybrid Fusion (CNN + Stacking Ensemble)
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" /> Download Report
          </button>
        </div>
      </div>

      {/* Main Prediction & GenAI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 ${colorClasses.bg} border ${colorClasses.border} p-6 rounded-2xl shadow-sm flex flex-col`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 bg-white/50 rounded-xl`}>
              {isPositive ? (
                <AlertTriangle className={`h-8 w-8 ${colorClasses.icon}`} />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${colorClasses.text}`}>
                {isPositive ? `Detected: ${result}` : "Result: Normal"}
              </h3>
              <p
                className={`${colorClasses.text} opacity-80 mt-2 leading-relaxed font-medium`}
              >
                {explanation}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 p-4 rounded-xl">
              <span className="text-xs font-bold uppercase tracking-wide opacity-60">
                Confidence Score
              </span>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-extrabold">{confidence}%</span>
                <span
                  className={`text-sm font-bold mb-1 ${confidence > 90 ? "text-red-600" : "text-orange-600"}`}
                >
                  {confidence > 90 ? "Very High" : "Moderate"}
                </span>
              </div>
              <div className="w-full bg-black/10 h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorClasses.bar}`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grad-CAM Visualization (Only show for AE) */}
        {isAE ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" /> MRI Analysis
              (Grad-CAM)
            </h3>

            {grad_cam_url ? (
              <div className="relative flex-1 rounded-xl overflow-hidden bg-black group">
                <img
                  src={`http://127.0.0.1:8000${grad_cam_url}`}
                  alt="Grad-CAM Heatmap"
                  className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-xs font-medium">
                    <span className="text-red-400 font-bold">Red Areas:</span>{" "}
                    High attention regions indicating potential lesions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200">
                <Brain className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm font-medium">
                  No MRI Analysis
                </p>
              </div>
            )}
          </div>
        ) : (
          // Placeholder for PV (No MRI)
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex flex-col justify-center items-center text-center">
            <Activity className="w-12 h-12 text-purple-300 mb-2" />
            <p className="text-purple-900 font-bold">Dermatological Analysis</p>
            <p className="text-sm text-purple-700">
              Imaging is not required for Pemphigus Vulgaris diagnosis.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Filtered Reference Ranges Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
              Biomarker Analysis (Detailed)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-3">Indicator</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Normal Range</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedIndicators.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.label}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {item.value} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.range}</td>
                    <td className={`px-6 py-4 font-medium ${item.className}`}>
                      • {item.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SHAP Indicators */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Feature Importance (SHAP)
            </h3>
            <p className="text-sm text-gray-500">
              Factors driving the AI decision.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-3">Factor</th>
                  <th className="px-6 py-3">Impact</th>
                  <th className="px-6 py-3">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shap_features.length > 0 ? (
                  shap_features.map((feat, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 font-medium">{feat.label}</td>
                      <td className="px-6 py-4">
                        <div className="w-24 h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-red-500"
                            style={{
                              width: `${Math.min(feat.display_value, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-red-700">
                        {feat.direction}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-gray-500">
                      Normal Range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Link
          to="/patient/doctors"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
        >
          Book Specialist Consultation
        </Link>
      </div>
    </div>
  );
};

export default PatientResults;
