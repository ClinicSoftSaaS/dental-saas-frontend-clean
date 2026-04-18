import { useState } from "react";
import { addPrescription } from "../api";

export default function Prescription({ patients = [] }) {
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: localStorage.getItem("userId") || "",
    medicines: "",
    notes: ""
  });

  const handleSubmit = async () => {
    if (!form.patient_id || !form.medicines) {
      alert("Patient and Medicines are required");
      return;
    }

    try {
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
      alert("Failed to save prescription");
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Prescription</h2>

      {/* Patient Select */}
      <select
        style={styles.input}
        value={form.patient_id}
        onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.phone})
          </option>
        ))}
      </select>

      {/* Medicines */}
      <textarea
        style={styles.textarea}
        placeholder="Enter Medicines (e.g. Paracetamol 500mg - 2 times a day)"
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

      <button style={styles.btn} onClick={handleSubmit}>
        Save Prescription
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "600px"
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
  }
};