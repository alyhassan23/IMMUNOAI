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
  Cpu,
} from "lucide-react";

const ServicesPage = () => {
  const aiServices = [
    {
      title: "Clinical Triage Engine",
      description:
        "Our first line of defense uses ensemble learning to screen patients based on tabular clinical data (blood markers, symptoms, history).",
      icon: <Database className="h-8 w-8 text-white" />,
      color: "bg-blue-600",
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
      icon: <ScanLine className="h-8 w-8 text-white" />,
      color: "bg-purple-600",
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
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "AI Report Generation",
      description:
        "GenAI-powered summaries that translate complex model outputs into readable natural language reports.",
      icon: <FileText className="h-6 w-6" />,
      accent: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Real-time Monitoring",
      description:
        "Track disease progression markers over time with interactive charts and historical data analysis.",
      icon: <Activity className="h-6 w-6" />,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Explainable AI (XAI)",
      description:
        "We provide SHAP values and visual explanations so doctors understand exactly why a diagnosis was made.",
      icon: <Brain className="h-6 w-6" />,
      accent: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Navbar lightMode={true} />

      {/* --- Page Header --- */}
      <div className="relative bg-slate-900 pt-32 pb-48 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        {/* Animated Background Blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-semibold mb-8 hover:bg-white/20 transition-colors cursor-default">
            <Cpu size={16} className="text-cyan-400" />
            <span>Advanced AI Pipeline</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Our Diagnostic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Services
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed font-light">
            Leveraging a{" "}
            <span className="text-white font-medium">
              hybrid AI architecture
            </span>{" "}
            to provide comprehensive, speed-of-light care for complex autoimmune
            conditions.
          </p>
        </div>
      </div>

      {/* --- Content Wrapper (Overlap Effect) --- */}
      <div className="relative z-20 -mt-24">
        <div className="bg-slate-50 rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-t border-white/50">
          {/* --- Core AI Services --- */}
          <div className="pt-12 md:pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                Core Technology
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Hybrid Diagnostic Pipeline
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {aiServices.map((service, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`p-4 rounded-2xl shadow-lg ${service.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        {service.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-slate-500 mb-8 text-lg leading-relaxed">
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
                          <span className="ml-3 text-slate-600 font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                    <Link
                      to="/contact"
                      className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2 group/link"
                    >
                      Request Demo{" "}
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Platform Features Grid --- */}
          <div className="bg-white border-t border-slate-100 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-16 text-center">
                Platform Capabilities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platformServices.map((service, index) => (
                  <div
                    key={index}
                    className="p-8 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-transparent hover:border-slate-100 transition-all duration-300 group cursor-default"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-transform group-hover:scale-110 ${service.bg} ${service.accent}`}
                    >
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- CTA Section --- */}
          <div className="relative py-24 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-extrabold text-white mb-6">
                Ready to integrate ImmunoAI?
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Join the network of specialists using advanced ensemble learning
                and computer vision to improve patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/contact"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Contact Sales
                </Link>
                <Link
                  to="/"
                  className="border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;
