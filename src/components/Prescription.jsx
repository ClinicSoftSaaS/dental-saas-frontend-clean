import { useEffect, useState } from "react";
import { getPatients } from "../api/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Prescription() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    medicines: "",
    notes: ""
  });

  // =========================
  // USER (DOCTOR)
  // =========================
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user?.id;

  // =========================
  // LOAD PATIENTS
  // =========================
  const loadPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(Array.isArray(res) ? res : []);
    } catch (err) {
      console.log("Patients error:", err);
    }
  };

  // =========================
  // LOAD PRESCRIPTIONS
  // =========================
  const loadPrescriptions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/prescriptions`);

      if (!res.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const data = await res.json();
      setPrescriptions(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log("Prescriptions error:", err);
    }
  };

  useEffect(() => {
    loadPatients();
    loadPrescriptions();
  }, []);

  // =========================
  // ADD PRESCRIPTION
  // =========================
  const handleSubmit = async () => {
    if (!form.patient_id || !form.medicines) {
      alert("Please select patient and enter medicines");
      return;
    }

    if (!doctorId) {
      alert("Doctor not found. Please login again.");
      return;
    }

    const payload = {
      patient_id: Number(form.patient_id),
      doctor_id: Number(doctorId),
      medicines: form.medicines,
      notes: form.notes
    };

    try {
      const res = await fetch(`${BASE_URL}/api/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("ERROR:", data);
        alert(data.detail || "Failed to save prescription");
        return;
      }

      alert("Prescription saved successfully ✔");

      // RESET FORM
      setForm({
        patient_id: "",
        medicines: "",
        notes: ""
      });

      // RELOAD LIST
      loadPrescriptions();

    } catch (err) {
      console.log("Server error:", err);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>💊 Prescriptions</h2>

      {/* ================= FORM ================= */}
      <div style={{
        padding: "15px",
        background: "#f4f6f8",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>

        <h3>Add Prescription</h3>

        {/* PATIENT DROPDOWN */}
        <select
          value={form.patient_id}
          onChange={(e) =>
            setForm({ ...form, patient_id: e.target.value })
          }
        >
          <option value="">Select Patient</option>

          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.phone}
            </option>
          ))}
        </select>

        <br /><br />

        {/* MEDICINES */}
        <input
          placeholder="Medicines"
          value={form.medicines}
          onChange={(e) =>
            setForm({ ...form, medicines: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        {/* NOTES */}
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px",
            height: "80px"
          }}
        />

        <br /><br />

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 15px",
            background: "#2c3e50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ➕ Save Prescription
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "15px"
      }}>
        {prescriptions.length === 0 ? (
          <p>No prescriptions found</p>
        ) : (
          prescriptions.map((p) => (
            <div
              key={p.id}
              style={{
                background: "linear-gradient(135deg, #2c3e50, #34495e)",
                color: "white",
                padding: "15px",
                borderRadius: "12px"
              }}
            >
              <h3>💊 Prescription #{p.id}</h3>

              <p>👤 Patient ID: {p.patient_id}</p>
              <p>🧑‍⚕️ Doctor ID: {p.doctor_id}</p>

              <div style={{
                marginTop: "10px",
                padding: "8px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)"
              }}>
                💊 {p.medicines}
              </div>

              {p.notes && (
                <p style={{ marginTop: "8px" }}>
                  📝 {p.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}