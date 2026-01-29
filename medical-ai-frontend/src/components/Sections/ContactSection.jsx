import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader, CheckCircle } from "lucide-react";
import { api } from "../../services/api"; // Import your configured axios instance

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
    // Map id to state keys (first-name -> first_name handling)
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
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Contact Info */}
          <div>
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">
              Get in Touch
            </h2>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              We'd love to hear from you
            </h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Have questions about our AI technology or want to schedule a demo
              for your clinic? Our team is ready to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-600">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    Chat to us
                  </h4>
                  <p className="text-gray-500 mb-1">
                    Our friendly team is here to help.
                  </p>
                  <a
                    href="mailto:support@immunoai.com"
                    className="text-blue-600 font-semibold hover:text-blue-700"
                  >
                    support@immunoai.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Visit us</h4>
                  <p className="text-gray-500 mb-1">
                    Come say hello at our office HQ.
                  </p>
                  <p className="text-gray-900 font-medium">
                    100 Smith Street, Collingwood VIC 3066 AU
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-600">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Call us</h4>
                  <p className="text-gray-500 mb-1">Mon-Fri from 8am to 5pm.</p>
                  <a
                    href="tel:+15550000000"
                    className="text-blue-600 font-semibold hover:text-blue-700"
                  >
                    +1 (555) 000-0000
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            {success && (
              <div className="absolute inset-0 bg-green-50 z-10 flex flex-col items-center justify-center animate-fade-in">
                <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-green-900">
                  Message Sent!
                </h3>
                <p className="text-green-700">
                  We will get back to you shortly.
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm outline-none"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm outline-none"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm outline-none"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm resize-none outline-none"
                  placeholder="Leave us a message..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
