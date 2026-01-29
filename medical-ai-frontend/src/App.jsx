import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import LandingPage from "./pages/Landing_page";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import DoctorsPage from "./pages/DoctorsPage";
import ContactPage from "./pages/ContactPage";
import DoctorProfilePublic from "./pages/DoctorProfilePublic";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPatient from "./pages/auth/RegisterPatient";
import RegisterDoctor from "./pages/auth/RegisterDoctor";
import DoctorInfoForm from "./pages/auth/DoctorInfoForm"; // NEW

// Patient Dashboard Components
import DashboardLayout from "./components/dashboard/DashboardLayout";
import PatientDashboardHome from "./pages/patient/PatientDashboardHome";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientDiagnosis from "./pages/patient/PatientDiagnosis";
import PatientResults from "./pages/patient/PatientResults";
import PatientDoctors from "./pages/patient/PatientDoctors";
import PatientDoctorProfile from "./pages/patient/DoctorProfile";
import PatientChat from "./pages/patient/PatientChat";
import TreatmentRecommendations from "./pages/patient/TreatmentRecommendations";
import PatientHistory from "./pages/patient/PatientHistory";
import PatientAppointments from "./pages/patient/PatientAppointments";

// Doctor Dashboard Components
import DoctorLayout from "./components/dashboard/DoctorLayout";
import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPatientDetail from "./pages/doctor/DoctorPatientDetail";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorChat from "./pages/doctor/DoctorChat";
import VideoCall from "./pages/VideoCall";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePublic />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route path="/doctor-setup" element={<DoctorInfoForm />} />

        {/* External Video Route */}
        <Route path="/video-call/:roomId" element={<VideoCall />} />

        {/* Patient Dashboard Routes */}
        <Route path="/patient" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboardHome />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="diagnosis" element={<PatientDiagnosis />} />
          <Route path="results" element={<PatientResults />} />
          <Route path="treatment" element={<TreatmentRecommendations />} />
          <Route path="doctors" element={<PatientDoctors />} />
          <Route path="doctors/:id" element={<PatientDoctorProfile />} />
          <Route path="messages" element={<PatientChat />} />
          <Route path="history" element={<PatientHistory />} />
          <Route path="appointments" element={<PatientAppointments />} />
        </Route>

        {/* Doctor Dashboard Routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorHome />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patients/:id" element={<DoctorPatientDetail />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="messages" element={<DoctorChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
