const BASE_URL = import.meta.env.VITE_API_URL;

// ---------------- AUTH ----------------
export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------------- PATIENTS ----------------
export async function getPatients() {
  const res = await fetch(`${BASE_URL}/api/patients/`);
  return res.json();
}

export async function addPatient(data) {
  const res = await fetch(`${BASE_URL}/api/patients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------------- APPOINTMENTS ----------------
export async function getAppointments() {
  const res = await fetch(`${BASE_URL}/api/appointments/`);
  return res.json();
}

export async function addAppointment(data) {
  const res = await fetch(`${BASE_URL}/api/appointments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------------- PRESCRIPTIONS ----------------
export async function getPrescriptions() {
  const res = await fetch(`${BASE_URL}/api/prescriptions/`);
  const data = await res.json();

  console.log("PRESCRIPTIONS API:", data);

  return Array.isArray(data) ? data : data.data || [];
}

export async function addPrescription(data) {
  const res = await fetch(`${BASE_URL}/api/prescriptions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------------- SEARCH ----------------
export async function searchPatientByPhone(phone) {
  const res = await fetch(`${BASE_URL}/api/patients/search/${phone}`);
  return res.json();
}