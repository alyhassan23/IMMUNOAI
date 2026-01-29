import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "The Grad-CAM visualizations provided by ImmunoAI have significantly reduced the time it takes for me to localize potential lesions in MRI scans. It's like having a second pair of expert eyes.",
      author: "Dr. Sarah Ahmed",
      role: "Neurologist, Mayo Hospital",
      initials: "SA",
      theme: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        quote: "text-blue-100",
      },
    },
    {
      id: 2,
      quote:
        "Combining tabular lab data with image analysis gives a much more complete picture of the patient's condition. A game changer for autoimmune cases where complexity is high.",
      author: "Dr. Ali Raza",
      role: "Immunologist, PKLI",
      initials: "AR",
      theme: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        quote: "text-purple-100",
      },
    },
    {
      id: 3,
      quote:
        "The automated risk assessment scoring has streamlined our workflow significantly. We can now focus more time on patient interaction and less on data crunching.",
      author: "Dr. Elena Rodriguez",
      role: "Head of Diagnostics, CareOne",
      initials: "ER",
      theme: {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        quote: "text-emerald-100",
      },
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(true); // Pause temporarily on interaction
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-16">
          Trusted by Professionals
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Carousel Container */}
          <div className="overflow-hidden relative min-h-[350px] md:min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute w-full transition-all duration-500 ease-in-out transform ${
                  index === currentIndex
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 translate-x-8 z-0"
                }`}
                // Using a simple fade/slide effect. Only the active one is fully visible.
                style={{ display: index === currentIndex ? "block" : "none" }}
                // Note: 'display: none' prevents layout shifts but breaks transition.
                // For a smooth transition, we remove display:none and use opacity/absolute positioning logic below:
              >
                {/* To fix the transition we actually keep them all in DOM but hide non-active */}
              </div>
            ))}

            {/* Re-rendering approach for simpler React transition without external libraries */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 relative mx-4 md:mx-12 transition-all duration-300">
              <div
                className={`absolute top-8 right-8 text-6xl ${testimonials[currentIndex].theme.quote} font-serif leading-none`}
              >
                "
              </div>
              <div className="flex items-center mb-6">
                <div
                  className={`h-14 w-14 ${testimonials[currentIndex].theme.bg} rounded-full flex items-center justify-center text-xl font-bold ${testimonials[currentIndex].theme.text} transition-colors duration-300`}
                >
                  {testimonials[currentIndex].initials}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    {testimonials[currentIndex].author}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed relative z-10 text-lg">
                "{testimonials[currentIndex].quote}"
              </p>
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2 md:-translate-x-6 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none z-20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 md:translate-x-6 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none z-20"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
