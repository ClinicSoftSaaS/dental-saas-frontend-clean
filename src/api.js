// ✅ HARDCODED API (to avoid env issues for now)
const API = "https://dental-saas-backend.onrender.com";

// ✅ Universal request handler
const request = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    console.log("API RESPONSE:", data);

    if (!res.ok) {
      throw new Error(
        typeof data === "object"
          ? JSON.stringify(data)
          : data || "Request failed"
      );
    }

    return data;
  } catch (err) {
    console.error("REQUEST ERROR:", err.message);
    throw err;
  }
};

//
// 🔐 AUTH
//
export const registerUser = (data) =>
  request(`${API}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  request(`${API}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

//
// 🧑 PATIENTS
//
export const getPatients = () =>
  request(`${API}/api/patients/`);

export const addPatient = (data) =>
  request(`${API}/api/patients/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

//
// 📅 APPOINTMENTS
//
export const getAppointments = () =>
  request(`${API}/api/appointments/`);

export const addAppointment = (data) =>
  request(`${API}/api/appointments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

//
// 💊 PRESCRIPTIONS
//
export const addPrescription = (data) =>
  request(`${API}/api/prescriptions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const getPrescriptions = (id) =>
  request(`${API}/api/prescriptions/${id}`);

export const searchPatientByPhone = (phone) =>
  request(`${API}/api/patients/search/phone/${phone}`);

export const getPatientHistory = (id) =>
  request(`${API}/api/patients/history/${id}`);