import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { api } from "../../services/api";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const key = e.target.id.replace("-", "_");
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/contact/submit/", formData);
      setSuccess(true);
      setFormData({ first_name: "", last_name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 bg-slate-50 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* --- Left Column: Contact Info & Map --- */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-6 w-fit">
              24/7 Support
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Let's start a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Conversation
              </span>
            </h2>

            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
              Have questions about our AI technology? Our clinical support team
              is ready to assist you with demos, pricing, and integration.
            </p>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Email Card */}
              <a
                href="mailto:support@immunoai.com"
                className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h4 className="font-bold text-slate-900">Email Us</h4>
                <p className="text-slate-500 text-sm">support@immunoai.com</p>
              </a>

              {/* Phone Card */}
              <a
                href="tel:+15550000000"
                className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold text-slate-900">Call Us</h4>
                <p className="text-slate-500 text-sm">+1 (555) 000-0000</p>
              </a>
            </div>

            {/* Visual Map Snippet */}
            <div className="relative w-full h-48 bg-slate-200 rounded-2xl overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
                style={{
                  backgroundImage:
                    "url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/144.9631,-37.8136,14,0/800x400?access_token=YOUR_TOKEN')",
                }}
              ></div>
              {/* Fallback pattern if no map image */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#00000010_1px,transparent_1px)] bg-[size:20px_20px]"></div>

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-full text-white">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Melbourne HQ
                  </p>
                  <p className="text-[10px] text-slate-500">
                    100 Smith St, Collingwood
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Form --- */}
          <div className="relative">
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/50 shadow-2xl relative overflow-hidden">
              {/* Success Overlay */}
              {success && (
                <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 text-center max-w-xs">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="first-name"
                      className="text-sm font-bold text-slate-700 ml-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last-name"
                      className="text-sm font-bold text-slate-700 ml-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-bold text-slate-700 ml-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    placeholder="doctor@clinic.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-bold text-slate-700 ml-1"
                  >
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none outline-none"
                    placeholder="Tell us about your clinic..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                  {loading ? (
                    <Loader className="animate-spin h-6 w-6" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message{" "}
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Decorative Elements behind form */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/30 rounded-full blur-2xl animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
