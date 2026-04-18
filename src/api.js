const API = "https://dental-saas-backend.onrender.com";

const request = async (url, options = {}) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.detail || "Request failed");
  }

  return data;
};

// AUTH
export const registerUser = (data) =>
  request(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  request(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// PATIENTS
export const getPatients = () =>
  request(`${API}/api/patients/`);

export const addPatient = (data) =>
  request(`${API}/api/patients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// APPOINTMENTS
export const getAppointments = () =>
  request(`${API}/api/appointments/`);

export const addAppointment = (data) =>
  request(`${API}/api/appointments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// PRESCRIPTIONS
export const addPrescription = (data) =>
  request(`${API}/api/prescriptions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const getPrescriptions = (id) =>
  request(`${API}/api/prescriptions/${id}`);

// SEARCH
export const searchPatientByPhone = (phone) =>
  request(`${API}/api/patients/search/phone/${phone}`);