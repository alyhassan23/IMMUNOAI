import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_name");
};

// ... (Keep existing submitDiagnosis, fetchPatientRegistry, verifyDiagnosis functions) ...
// Important: Update submitDiagnosis to NOT use multipart config manually if possible,
// or ensure the interceptor works with it.
// ... existing imports and setup ...

// ... existing login/register/submit functions ...
export const login = async (email, password) => {
  const response = await api.post("/auth/login/", { email, password });
  if (response.data.access) {
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("user_role", response.data.role);
    localStorage.setItem("user_name", response.data.name);
    localStorage.setItem("user_id", response.data.user_id);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register/", userData);
  return response.data;
};

export const submitDiagnosis = async (formData) => {
  try {
    const response = await api.post("/predict/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NEW FUNCTIONS
export const fetchPatientHistory = async () => {
  const response = await api.get("/patient/history/");
  return response.data;
};

export const fetchPatientAppointments = async () => {
  const response = await api.get("/patient/appointments/");
  return response.data;
};

// ... keep fetchPatientRegistry and verifyDiagnosis ...
export const fetchPatientRegistry = async () => {
  const response = await api.get("/doctor/patients/");
  return response.data;
};

export const verifyDiagnosis = async (sessionId, status, notes) => {
  const response = await api.post(`/doctor/verify/${sessionId}/`, {
    status,
    notes,
  });
  return response.data;
};
// Add this new function
export const fetchDoctorAppointments = async () => {
  const response = await api.get("/doctor/appointments/");
  return response.data;
};

// Ensure this one exists from previous steps
export const getContacts = async () => {
  const response = await api.get("/chat/contacts/");
  return response.data;
};

// ... existing imports ...

// Add these new functions
export const fetchAllDoctors = async () => {
  const response = await api.get("/public/doctors/");
  return response.data;
};

export const fetchDoctorDetail = async (id) => {
  const response = await api.get(`/public/doctors/${id}/`);
  return response.data;
};

// ... existing imports ...

export const getProfile = async () => {
  const response = await api.get("/profile/get/");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.post("/profile/update/", data);
  return response.data;
};
