import React from "react";
import {
  Brain,
  Twitter,
  Github,
  Linkedin,
  ArrowRight,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-slate-50 pt-20 pb-10 overflow-hidden border-t border-slate-200">
      {/* --- Background Decor --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Soft Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* --- Brand Column (4 Cols) --- */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                ImmunoAI
              </span>
            </div>

            <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">
              Revolutionizing autoimmune diagnosis with Multimodal AI Fusion.
              Bridging the gap between tabular clinical data and 3D MRI imaging.
            </p>

            <div className="flex gap-4">
              <SocialLink
                icon={<Twitter size={20} />}
                href="#"
                color="hover:bg-sky-500"
              />
              <SocialLink
                icon={<Github size={20} />}
                href="#"
                color="hover:bg-slate-800"
              />
              <SocialLink
                icon={<Linkedin size={20} />}
                href="#"
                color="hover:bg-blue-700"
              />
            </div>
          </div>

          {/* --- Links Column 1 (2 Cols) --- */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4">
              <FooterLink href="#">AI Diagnosis</FooterLink>
              <FooterLink href="#">Tele-Consultation</FooterLink>
              <FooterLink href="#">Research Data</FooterLink>
              <FooterLink href="#">Success Stories</FooterLink>
            </ul>
          </div>

          {/* --- Links Column 2 (2 Cols) --- */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </ul>
          </div>

          {/* --- Newsletter Column (3 Cols) --- */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-blue-100/50">
              <h4 className="font-bold text-slate-900 mb-2">Stay Updated</h4>
              <p className="text-sm text-slate-500 mb-4">
                Get the latest research breakthroughs directly to your inbox.
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 pr-12 outline-none transition-all"
                />
                <button className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors shadow-md shadow-blue-500/30">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} ImmunoAI. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <span>Terms</span>
            <span>Privacy</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with{" "}
              <Heart
                size={14}
                className="text-red-400 fill-red-400 animate-pulse"
              />{" "}
              in 2024
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components ---

const SocialLink = ({ icon, href, color }) => (
  <a
    href={href}
    className={`w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm transition-all duration-300 hover:text-white hover:-translate-y-1 ${color}`}
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-slate-500 hover:text-blue-600 transition-all duration-200 flex items-center group"
    >
      <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-1 text-blue-400">
        •
      </span>
      {children}
    </a>
  </li>
);

export default Footer;
