import { useEffect, useState } from "react";
import { getPatients, addAppointment } from "../api";

export default function AddAppointment() {
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    date: ""
  });

  const doctorId = localStorage.getItem("userId");

  // Load patients from backend
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      alert("Error loading patients");
    }
  };

  // Submit appointment
  const submitAppointment = async () => {
    console.log("FORM:", form); // DEBUG

    if (!form.patient_id) {
      alert("Please select a patient");
      return;
    }

    if (!form.date) {
      alert("Please select date and time");
      return;
    }

    const payload = {
      patient_id: Number(form.patient_id),
      doctor_id: Number(doctorId),
      date: new Date(form.date).toISOString()
    };

    const res = await addAppointment(payload);

    if (!res.ok) {
      alert("Failed to create appointment");
      return;
    }

    alert("Appointment created successfully!");

    setForm({
      patient_id: "",
      date: ""
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Appointment</h2>

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

      {/* DATE PICKER */}
      <input
        type="datetime-local"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <br /><br />

      <button onClick={submitAppointment}>
        Create Appointment
      </button>
    </div>
  );
}