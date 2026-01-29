import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  Brain,
  FileText,
  Video,
  Activity,
  Database,
  ScanLine,
  ArrowRight,
} from "lucide-react";

const ServicesPage = () => {
  const aiServices = [
    {
      title: "Clinical Triage Engine",
      description:
        "Our first line of defense uses ensemble learning to screen patients based on tabular clinical data (blood markers, symptoms, history).",
      icon: <Database className="h-8 w-8 text-blue-600" />,
      features: [
        "Rapid screening for AE, PV, and Normal cases",
        "Ensemble of Random Forest, XGBoost, & LightGBM",
        "Voting Classifier for high-confidence predictions",
        "Instant results without expensive imaging",
      ],
    },
    {
      title: "Neuro-Imaging Analysis",
      description:
        "Deep learning analysis specifically designed for confirmed or suspected Autoimmune Encephalitis cases requiring MRI validation.",
      icon: <ScanLine className="h-8 w-8 text-purple-600" />,
      features: [
        "Specialized CNN architecture for Brain MRIs",
        "Grad-CAM heatmaps to localize lesions",
        "Automated probability scoring",
        "Seamless integration with PACS systems",
      ],
    },
  ];

  const platformServices = [
    {
      title: "Tele-Consultation",
      description:
        "Connect directly with specialists via secure, HD video calls integrated right into the patient dashboard.",
      icon: <Video className="h-6 w-6" />,
    },
    {
      title: "AI Report Generation",
      description:
        "GenAI-powered summaries that translate complex model outputs into readable natural language reports.",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Real-time Monitoring",
      description:
        "Track disease progression markers over time with interactive charts and historical data analysis.",
      icon: <Activity className="h-6 w-6" />,
    },
    {
      title: "Explainable AI (XAI)",
      description:
        "We provide SHAP values and visual explanations so doctors understand exactly why a diagnosis was made.",
      icon: <Brain className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Page Header */}
      <div className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Our Diagnostic Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Leveraging hybrid AI architecture to provide comprehensive care for
            autoimmune conditions.
          </p>
        </div>
      </div>

      {/* Core AI Services */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
            Core Technology
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            Hybrid Diagnostic Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {aiServices.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-sm font-bold">
                          ✓
                        </span>
                      </div>
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                <Link
                  to="/contact"
                  className="text-blue-600 font-semibold hover:text-blue-800 flex items-center"
                >
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center">
            Platform Capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformServices.map((service, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300 group cursor-default"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-600 group-hover:text-blue-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to integrate ImmunoAI?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the network of specialists using advanced ensemble learning and
            computer vision to improve patient outcomes.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Contact Sales
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
