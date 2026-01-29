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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              {isForgotMode ? (
                <KeyRound className="h-6 w-6 text-white" />
              ) : (
                <Brain className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isForgotMode ? "Reset Password" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isForgotMode
                ? resetStep === "email"
                  ? "Enter your email to verify account."
                  : "Create a new strong password."
                : `Sign in to access your ${role === "doctor" ? "medical dashboard" : "health portal"}`}
            </p>
          </div>

          {!isForgotMode && (
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  role === "patient"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="w-4 h-4 mr-2" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  role === "doctor"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Stethoscope className="w-4 h-4 mr-2" /> Doctor
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {!isForgotMode && (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-500"
                    placeholder="name@example.com"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-500"
                    placeholder="••••••••"
                    onChange={handleInputChange}
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                }`}
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign in <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FLOW */}
          {isForgotMode && (
            <div className="mt-8 space-y-6">
              {/* Step 1: Email */}
              {resetStep === "email" && (
                <form onSubmit={handleResetRequest}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-500"
                      placeholder="name@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 mt-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
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
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                    Verifying: <strong>{resetEmail}</strong>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                        className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-500"
                        placeholder="New Password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                        className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-500"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 mt-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
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
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100 animate-fade-in">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-green-900">Success!</h3>
                  <p className="text-sm text-green-700 mt-2">
                    Your password has been updated in the database. You can now
                    login.
                  </p>
                  <button
                    onClick={resetForgotFlow}
                    className="mt-6 w-full py-3 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {resetStep !== "success" && (
                <button
                  type="button"
                  onClick={resetForgotFlow}
                  className="w-full text-center mt-4 text-sm text-gray-500 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {!isForgotMode && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to={
                    role === "doctor" ? "/register-doctor" : "/register-patient"
                  }
                  className="font-bold text-blue-600 hover:text-blue-500"
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
