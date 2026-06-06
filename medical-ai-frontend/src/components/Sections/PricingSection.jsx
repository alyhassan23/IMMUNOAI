import React, { useState } from "react";
import { Check, X, Zap, Sparkles, Shield, Building2 } from "lucide-react";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Basic Analysis",
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      price: "Free",
      period: "/forever",
      description: "Essential AI screening for early symptom detection.",
      features: [
        "Symptom Checker Chatbot",
        "Basic Risk Assessment",
        "Email Support",
        "1 MRI Scan Upload/Month",
      ],
      notIncluded: [
        "Doctor Tele-consultation",
        "Grad-CAM Visualizations",
        "Priority Processing",
      ],
      cta: "Get Started",
      popular: false,
      color: "blue",
    },
    {
      name: "Complete Care",
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      price: billingCycle === "monthly" ? "$49" : "$39",
      period: "/month",
      description: "Full diagnostic suite with professional medical oversight.",
      features: [
        "Unlimited AI Diagnosis",
        "Detailed SHAP & Grad-CAM Reports",
        "1 Tele-consultation/Month",
        "24/7 Priority Support",
        "Health History Timeline",
      ],
      notIncluded: ["API Access"],
      cta: "Start Free Trial",
      popular: true,
      color: "purple",
    },
    {
      name: "Clinic Enterprise",
      icon: <Building2 className="w-6 h-6 text-emerald-500" />,
      price: "Custom",
      period: "",
      description: "High-volume processing for hospitals and research labs.",
      features: [
        "Batch MRI Processing",
        "API Integration",
        "Dedicated Account Manager",
        "Custom Model Fine-tuning",
        "HIPAA Compliant Server",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      popular: false,
      color: "emerald",
    },
  ];

  return (
    <section
      id="pricing"
      className="relative py-24 bg-slate-50 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-purple-200/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* --- Header --- */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">
            Flexible Plans
          </h2>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Transparent Pricing for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Every Need
            </span>
          </h2>
          <p className="text-xl text-slate-500 mb-10">
            Choose the plan that fits your diagnostic needs. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm font-semibold ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className="relative w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </button>
            <span
              className={`text-sm font-semibold flex items-center gap-2 ${billingCycle === "yearly" ? "text-slate-900" : "text-slate-400"}`}
            >
              Yearly
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* --- Pricing Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group rounded-[2rem] p-8 transition-all duration-300 flex flex-col h-full ${
                plan.popular
                  ? "bg-white border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                  : "bg-white/60 border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm"
              }`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/30">
                    <Zap size={14} className="fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className="mb-6">
                <div
                  className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${
                    plan.popular
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {plan.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-500 text-sm h-10 mb-4">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 mb-8">
                <div className="h-px bg-slate-100 w-full mb-6"></div>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          plan.popular
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-slate-600 text-sm font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start opacity-50 grayscale"
                    >
                      <X className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-400 text-sm line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
