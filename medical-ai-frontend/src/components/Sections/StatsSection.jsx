import React from "react";

const StatsSection = () => {
  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          <div className="p-4">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              94%
            </div>
            <div className="text-gray-500 font-medium">
              Fusion Accuracy (AE)
            </div>
          </div>
          <div className="p-4">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">3D</div>
            <div className="text-gray-500 font-medium">MRI Volume Analysis</div>
          </div>
          <div className="p-4">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              15+
            </div>
            <div className="text-gray-500 font-medium">Biomarkers Analyzed</div>
          </div>
          <div className="p-4">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              XAI
            </div>
            <div className="text-gray-500 font-medium">SHAP & Grad-CAM</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
