import React from "react";
import { Check, X, Zap } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic Analysis",
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
    },
    {
      name: "Complete Care",
      price: "Custom",
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
    },
    {
      name: "Clinic Enterprise",
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
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-500">
            Choose the plan that fits your diagnostic needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border ${
                plan.popular
                  ? "border-blue-600 shadow-xl scale-105 z-10"
                  : "border-gray-200 shadow-sm hover:shadow-lg"
              } transition-all duration-300 bg-white flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Zap size={14} className="fill-current" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-500 mt-4 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <li key={idx} className="flex items-start opacity-50">
                    <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-500 text-sm line-through">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-xl font-bold transition-colors ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
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
