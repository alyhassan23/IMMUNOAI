import React, { useState } from "react";
import {
  BookOpen,
  AlertTriangle,
  Shield,
  Activity,
  Pill,
  Syringe,
  ArrowRight,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

const TreatmentRecommendations = () => {
  const [activeCondition, setActiveCondition] = useState("AE"); // 'AE' or 'PV'

  const guidelines = {
    AE: {
      title: "Autoimmune Encephalitis",
      source: "Graus et al. (2016) Clinical Criteria Guidelines",
      firstLine: [
        {
          name: "Corticosteroids",
          detail: "IV Methylprednisolone (1g/day for 3-5 days)",
          mechanism: "Reduces acute inflammation rapidly.",
          icon: <Pill className="w-5 h-5 text-blue-600" />,
        },
        {
          name: "IVIG (Intravenous Immunoglobulin)",
          detail: "0.4 g/kg/day for 5 days",
          mechanism: "Neutralizes harmful autoantibodies.",
          icon: <Syringe className="w-5 h-5 text-green-600" />,
        },
        {
          name: "Plasmapheresis (PLEX)",
          detail: "5-7 exchanges over 10-14 days",
          mechanism: "Physically removes antibodies from blood plasma.",
          icon: <Activity className="w-5 h-5 text-purple-600" />,
        },
      ],
      secondLine: [
        {
          name: "Rituximab",
          detail: "Anti-CD20 Monoclonal Antibody",
          note: "Used if no response to first-line therapy within 10-14 days.",
        },
        {
          name: "Cyclophosphamide",
          detail: "Immunosuppressive chemotherapy",
          note: "Reserved for severe, refractory cases.",
        },
      ],
    },
    PV: {
      title: "Pemphigus Vulgaris",
      source: "International Panel on Pemphigus Therapy",
      firstLine: [
        {
          name: "Systemic Corticosteroids",
          detail: "Oral Prednisone (0.5–1.0 mg/kg/day)",
          mechanism: "Controls blister formation and inflammation.",
          icon: <Pill className="w-5 h-5 text-blue-600" />,
        },
        {
          name: "Rituximab",
          detail: "Two 1g infusions, 2 weeks apart",
          mechanism: "Targets B-cells to stop antibody production.",
          icon: <Syringe className="w-5 h-5 text-purple-600" />,
        },
      ],
      secondLine: [
        {
          name: "Mycophenolate Mofetil",
          detail: "Adjuvant immunosuppressant",
          note: "Steroid-sparing agent for long-term maintenance.",
        },
        {
          name: "Azathioprine",
          detail: "Anti-metabolite",
          note: "Traditional alternative to Mycophenolate.",
        },
      ],
    },
  };

  const currentData = guidelines[activeCondition];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl flex items-start gap-4">
        <div className="p-3 bg-yellow-100 rounded-xl flex-shrink-0">
          <AlertTriangle className="h-8 w-8 text-yellow-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-yellow-900 mb-2">
            Clinical Reference Only
          </h2>
          <p className="text-yellow-800 text-sm leading-relaxed">
            <strong>IMPORTANT:</strong> The protocols listed below are{" "}
            <em>evidence-based suggestions</em> derived from standard medical
            guidelines. They are <strong>NOT</strong> active prescriptions.
            Dosage, duration, and suitability must be determined by a qualified
            specialist based on patient weight, comorbidities, and renal
            function.
          </p>
        </div>
      </div>

      {/* Condition Selector */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveCondition("AE")}
          className={`px-8 py-4 rounded-xl font-bold transition-all shadow-sm flex flex-col items-center gap-2 ${
            activeCondition === "AE"
              ? "bg-blue-600 text-white ring-4 ring-blue-100"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">Autoimmune Encephalitis</span>
          <span className="text-xs font-medium opacity-80 uppercase tracking-wide">
            Neurology Protocol
          </span>
        </button>
        <button
          onClick={() => setActiveCondition("PV")}
          className={`px-8 py-4 rounded-xl font-bold transition-all shadow-sm flex flex-col items-center gap-2 ${
            activeCondition === "PV"
              ? "bg-purple-600 text-white ring-4 ring-purple-100"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">Pemphigus Vulgaris</span>
          <span className="text-xs font-medium opacity-80 uppercase tracking-wide">
            Dermatology Protocol
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Protocol Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* First Line Therapies */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                First-Line Therapies
              </h3>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
                Standard of Care
              </span>
            </div>
            <div className="p-6 space-y-6">
              {currentData.firstLine.map((therapy, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                    {therapy.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {therapy.name}
                    </h4>
                    <p className="text-blue-600 font-medium text-sm mb-1">
                      {therapy.detail}
                    </p>
                    <p className="text-gray-500 text-sm italic">
                      "{therapy.mechanism}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Line Therapies */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Second-Line / Maintenance
              </h3>
              <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded">
                If Refractory
              </span>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {currentData.secondLine.map((therapy, idx) => (
                  <li
                    key={idx}
                    className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <span className="font-bold text-gray-900 block">
                        {therapy.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {therapy.detail}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {therapy.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2">Need a Prescription?</h3>
            <p className="text-blue-200 text-sm mb-6">
              Only a verified specialist can authorize these treatments. Connect
              with a doctor now to review your diagnosis.
            </p>
            <Link
              to="/patient/doctors"
              className="block w-full text-center bg-white text-blue-900 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              Find Specialist
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Source Guideline
            </h4>
            <p className="text-sm text-gray-600 italic mb-4">
              {currentData.source}
            </p>
            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <Info className="w-3 h-3 inline mr-1 mb-0.5" />
              These protocols are updated quarterly based on international
              consensus.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentRecommendations;
