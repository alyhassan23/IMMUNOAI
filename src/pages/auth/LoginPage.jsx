import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  User,
  Stethoscope,
  ArrowRight,
  Loader,
  AlertCircle,
  KeyRound,
  CheckCircle,
  Lock,
  Mail,
  ChevronLeft,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { login, api } from "../../services/api";

const LoginPage = () => {
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetStep, setResetStep] = useState("email"); // 'email', 'password', 'success'
  const [resetEmail, setResetEmail] = useState("");
  const [newPassData, setNewPassData] = useState({ password: "", confirm: "" });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);

      if (response.role !== role) {
        setError(
          `This account is registered as a ${response.role}. Please switch tabs.`,
        );
        setIsLoading(false);
        localStorage.clear();
        return;
      }

      if (response.role === "patient") {
        navigate("/patient/dashboard");
      } else {
        navigate("/doctor/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Verify Email
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/verify-email/", { email: resetEmail });
      setResetStep("password");
    } catch (e) {
      setError("Email address not found.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password in Database
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassData.password !== newPassData.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/reset-password/", {
        email: resetEmail,
        password: newPassData.password,
      });
      setResetStep("success");
    } catch (e) {
      setError("Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setIsForgotMode(false);
    setResetStep("email");
    setResetEmail("");
    setNewPassData({ password: "", confirm: "" });
    setError("");
  };

  return (
    <div className="min-h-screen font-sans relative flex flex-col overflow-hidden bg-slate-900">
      {/* Navbar with white text mode for dark background */}
      <Navbar lightMode={true} />

      {/* --- Animated Background Elements --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      {/* --- Main Content --- */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-24">
        <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20">
          {/* Header Area */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 mb-6 text-white transform transition-transform hover:scale-105 hover:rotate-3">
              {isForgotMode ? (
                <KeyRound className="h-8 w-8" />
              ) : (
                <Brain className="h-9 w-9" />
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isForgotMode ? "Reset Password" : "Welcome Back"}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {isForgotMode
                ? resetStep === "email"
                  ? "Enter your email to verify account."
                  : "Create a new strong password."
                : `Sign in to access your ${role === "doctor" ? "medical dashboard" : "health portal"}`}
            </p>
          </div>

          {/* Role Switcher (Only visible in Login Mode) */}
          {!isForgotMode && (
            <div className="relative flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              {/* Sliding Background */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${role === "doctor" ? "translate-x-full left-1.5" : "left-1.5"}`}
              ></div>

              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 relative z-10 flex items-center justify-center py-2.5 text-sm font-bold transition-colors duration-200 ${
                  role === "patient"
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <User className="w-4 h-4 mr-2" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex-1 relative z-10 flex items-center justify-center py-2.5 text-sm font-bold transition-colors duration-200 ${
                  role === "doctor"
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Stethoscope className="w-4 h-4 mr-2" /> Doctor
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-start animate-fade-in">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* --- LOGIN FORM --- */}
          {!isForgotMode && (
            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                      placeholder="name@example.com"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                      placeholder="••••••••"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white transition-all duration-300 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center">
                    Sign in{" "}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          )}

          {/* --- FORGOT PASSWORD FLOW --- */}
          {isForgotMode && (
            <div className="mt-8 space-y-6">
              {/* Step 1: Email */}
              {resetStep === "email" && (
                <form onSubmit={handleResetRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      Registered Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                  >
                    {isLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      "Verify Email"
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: New Password */}
              {resetStep === "password" && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-sm text-blue-800 flex items-center mb-4">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                    <span>
                      Verifying: <strong>{resetEmail}</strong>
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="password"
                        required
                        value={newPassData.password}
                        onChange={(e) =>
                          setNewPassData({
                            ...newPassData,
                            password: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                        placeholder="New Password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="password"
                        required
                        value={newPassData.confirm}
                        onChange={(e) =>
                          setNewPassData({
                            ...newPassData,
                            confirm: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                  >
                    {isLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              )}

              {/* Step 3: Success */}
              {resetStep === "success" && (
                <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-100 animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900">Success!</h3>
                  <p className="text-sm text-green-700 mt-2 mb-6">
                    Your password has been securely updated. You can now log in
                    with your new credentials.
                  </p>
                  <button
                    onClick={resetForgotFlow}
                    className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {resetStep !== "success" && (
                <button
                  type="button"
                  onClick={resetForgotFlow}
                  className="w-full text-center mt-2 text-sm text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Cancel & Return
                </button>
              )}
            </div>
          )}

          {/* Footer Area */}
          {!isForgotMode && (
            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to={
                    role === "doctor" ? "/register-doctor" : "/register-patient"
                  }
                  className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                >
                  Register as {role === "doctor" ? "Doctor" : "Patient"}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
