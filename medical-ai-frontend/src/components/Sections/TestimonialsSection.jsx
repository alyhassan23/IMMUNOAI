import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  BadgeCheck,
} from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "The Grad-CAM visualizations provided by ImmunoAI have significantly reduced the time it takes for me to localize potential lesions in MRI scans. It's like having a second pair of expert eyes.",
      author: "Dr. Sarah Ahmed",
      role: "Neurologist, Mayo Hospital",
      initials: "SA",
      color: "from-blue-400 to-cyan-400",
    },
    {
      id: 2,
      quote:
        "Combining tabular lab data with image analysis gives a much more complete picture of the patient's condition. A game changer for autoimmune cases where complexity is high.",
      author: "Dr. Ali Raza",
      role: "Immunologist, PKLI",
      initials: "AR",
      color: "from-purple-400 to-pink-400",
    },
    {
      id: 3,
      quote:
        "The automated risk assessment scoring has streamlined our workflow significantly. We can now focus more time on patient interaction and less on data crunching.",
      author: "Dr. Elena Rodriguez",
      role: "Head of Diagnostics, CareOne",
      initials: "ER",
      color: "from-emerald-400 to-teal-400",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance logic
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const handleManualChange = (direction) => {
    setIsPaused(true);
    if (direction === "next") {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      setCurrentIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length,
      );
    }
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4 border border-blue-100">
            Trusted by Professionals
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900">
            Hear from our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Partners
            </span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Card */}
          {/* Key prop ensures React remounts the component to trigger CSS animations on slide change */}
          <div
            key={currentIndex}
            className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 border border-white shadow-2xl relative animate-[fadeInUp_0.6s_ease-out]"
          >
            {/* Giant Background Quote Icon */}
            <Quote className="absolute top-10 left-10 text-slate-100 w-32 h-32 -z-10 rotate-180" />

            <div className="flex flex-col items-center text-center relative z-10">
              {/* Rating & Badge */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-500">
                  <BadgeCheck size={16} className="text-blue-500" /> Verified
                  User
                </div>
              </div>

              {/* Quote Text */}
              <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed mb-10 italic">
                "{testimonials[currentIndex].quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 text-left">
                {/* Avatar with Gradient Ring */}
                <div
                  className={`h-16 w-16 rounded-full bg-gradient-to-br ${testimonials[currentIndex].color} p-[3px]`}
                >
                  <div className="h-full w-full bg-white rounded-full flex items-center justify-center">
                    <span
                      className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${testimonials[currentIndex].color}`}
                    >
                      {testimonials[currentIndex].initials}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {testimonials[currentIndex].author}
                  </h4>
                  <p className="text-slate-500 text-sm">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls - Floating on sides */}
          <button
            onClick={() => handleManualChange("prev")}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-4 rounded-full bg-white shadow-lg shadow-slate-200 text-slate-400 hover:text-blue-600 hover:scale-110 transition-all z-20 focus:outline-none"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={() => handleManualChange("next")}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-4 rounded-full bg-white shadow-lg shadow-slate-200 text-slate-400 hover:text-blue-600 hover:scale-110 transition-all z-20 focus:outline-none"
          >
            <ChevronRight size={28} />
          </button>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPaused(true);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? "w-12 bg-gradient-to-r from-blue-600 to-purple-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Inline Animation Style for the fade up effect */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
