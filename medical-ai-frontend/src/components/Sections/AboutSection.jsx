import React from "react";
import { Brain, Layers, FileSearch } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">
            Our Technology
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            A Hybrid Framework for Complex Diagnostics
          </p>
          <p className="max-w-3xl text-xl text-gray-500 mx-auto leading-relaxed">
            Standard AI treats images and data separately. ImmunoAI employs a{" "}
            <strong>Multimodal Fusion Network</strong> that synthesizes 3D MRI
            scans with clinical history (tabular data) to meet the{" "}
            <strong>Graus Clinical Criteria</strong> for diagnosis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Fusion ANN */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Fusion ANN (AE Head)
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Combines <strong>ResNet50</strong> feature embeddings from MRI
              scans (T1/T2/FLAIR) with tabular embeddings to detect Autoimmune
              Encephalitis with high sensitivity.
            </p>
          </div>

          {/* Card 2: Ensemble Stacking */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Ensemble Stack (PV Head)
            </h3>
            <p className="text-gray-500 leading-relaxed">
              A meta-learner stacking{" "}
              <strong>XGBoost, LightGBM, and Random Forest</strong>. It
              processes tabular inputs (Dsg1/Dsg3 indices, antibody titers) for
              Pemphigus Vulgaris detection.
            </p>
          </div>

          {/* Card 3: Explainability */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="bg-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <FileSearch className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Explainable AI (XAI)
            </h3>
            <p className="text-gray-500 leading-relaxed">
              We eliminate "Black Box" decisions. <strong>Grad-CAM</strong>{" "}
              visualizes lesion hotspots on MRI slices, while{" "}
              <strong>SHAP</strong> plots quantify the impact of each clinical
              feature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
