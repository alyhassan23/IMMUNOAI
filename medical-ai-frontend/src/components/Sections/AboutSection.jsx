import React from "react";
import { Brain, Layers, FileSearch, Cpu, Network, ScanEye } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 overflow-hidden bg-slate-50">
      {/* --- Background Elements --- */}
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* --- Header --- */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-2 mb-6 bg-white rounded-full shadow-sm border border-slate-200">
            <span className="px-3 py-1 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
              Core Architecture
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            A Hybrid Framework for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              Complex Diagnostics
            </span>
          </h2>

          <p className="text-xl text-slate-500 leading-relaxed">
            Standard AI treats images and data separately. ImmunoAI employs a{" "}
            <span className="font-semibold text-slate-800 decoration-blue-400/50 underline decoration-2 underline-offset-4">
              Multimodal Fusion Network
            </span>{" "}
            that synthesizes 3D MRI scans with clinical history to meet the
            Graus Clinical Criteria.
          </p>
        </div>

        {/* --- Card Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Fusion ANN (Blue) */}
          <div className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8" />
                </div>
                <Cpu className="text-blue-100 h-10 w-10 group-hover:text-blue-200 transition-colors" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                Fusion ANN{" "}
                <span className="text-sm font-normal text-slate-400 block mt-1">
                  (AE Head)
                </span>
              </h3>

              <p className="text-slate-500 mb-8 leading-relaxed">
                Combines <strong>ResNet50</strong> feature embeddings from MRI
                scans (T1/T2/FLAIR) with tabular embeddings to detect Autoimmune
                Encephalitis.
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full border border-blue-200">
                  ResNet50
                </span>
                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full border border-blue-200">
                  CNN
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Ensemble Stacking (Purple) */}
          <div className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Layers className="h-8 w-8" />
                </div>
                <Network className="text-purple-100 h-10 w-10 group-hover:text-purple-200 transition-colors" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-700 transition-colors">
                Ensemble Stack{" "}
                <span className="text-sm font-normal text-slate-400 block mt-1">
                  (PV Head)
                </span>
              </h3>

              <p className="text-slate-500 mb-8 leading-relaxed">
                A meta-learner stacking{" "}
                <strong>XGBoost, LightGBM, & Random Forest</strong>. Processes
                Dsg1/Dsg3 indices and antibody titers.
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full border border-purple-200">
                  XGBoost
                </span>
                <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full border border-purple-200">
                  Meta-Learner
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Explainability (Emerald) */}
          <div className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FileSearch className="h-8 w-8" />
                </div>
                <ScanEye className="text-emerald-100 h-10 w-10 group-hover:text-emerald-200 transition-colors" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                Explainable AI{" "}
                <span className="text-sm font-normal text-slate-400 block mt-1">
                  (XAI)
                </span>
              </h3>

              <p className="text-slate-500 mb-8 leading-relaxed">
                Eliminating "Black Box" decisions. <strong>Grad-CAM</strong>{" "}
                visualizes lesion hotspots, while <strong>SHAP</strong> plots
                quantify clinical feature impact.
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                  Grad-CAM
                </span>
                <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                  SHAP Values
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
