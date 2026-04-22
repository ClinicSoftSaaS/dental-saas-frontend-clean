import React from "react";
import { useState } from "react";
import { addPrescription, getPrescriptions } from "../api.js";

export default function Prescription({ patients = [] }) {
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: localStorage.getItem("userId") || "",
    medicines: "",
    notes: ""
  });

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // SAVE PRESCRIPTION
  // =========================
  const handleSubmit = async () => {
    if (!form.patient_id || !form.medicines) {
      alert("Patient and Medicines are required");
      return;
    }

    try {
      setLoading(true);

      await addPrescription({
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        medicines: form.medicines,
        notes: form.notes
      });

      alert("Prescription saved successfully!");

      setForm({
        ...form,
        medicines: "",
        notes: ""
      });

    } catch (err) {
      alert(err.message || "Failed to save prescription");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD PRESCRIPTIONS
  // =========================
  const loadPrescriptions = async () => {
    if (!form.patient_id) {
      alert("Select patient first");
      return;
    }

    try {
      setLoading(true);

      const res = await getPrescriptions(form.patient_id);

      setList(res.data || []);

    } catch (err) {
      alert(err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Prescription</h2>

      {/* Patient Select */}
      <select
        style={styles.input}
        value={form.patient_id}
        onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
      >
        <option value="">Select Patient</option>
        {patients.length === 0 ? (
          <option disabled>No patients available</option>
        ) : (
          patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.phone})
            </option>
          ))
        )}
      </select>

      {/* Medicines */}
      <textarea
        style={styles.textarea}
        placeholder="Medicines (e.g. Panadol 500mg twice daily)"
        value={form.medicines}
        onChange={(e) => setForm({ ...form, medicines: e.target.value })}
      />

      {/* Notes */}
      <textarea
        style={styles.textareaSmall}
        placeholder="Notes / Instructions"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          Save
        </button>

        <button style={styles.btnSecondary} onClick={loadPrescriptions} disabled={loading}>
          Load History
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* HISTORY TABLE */}
      <h3>Prescription History</h3>

      {list.length === 0 ? (
        <p>No prescriptions found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicines</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.medicines}</td>
                <td>{p.notes}</td>
                <td>{new Date(p.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "700px"
  },

  title: {
    marginBottom: "15px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "none"
  },

  textareaSmall: {
    width: "100%",
    height: "80px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "none"
  },

  btn: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  btnSecondary: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};