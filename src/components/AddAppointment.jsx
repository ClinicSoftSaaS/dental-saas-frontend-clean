import { useEffect, useState } from "react";
import { getPatients, addAppointment } from "../api/api";

export default function AddAppointment() {
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    date: "",
  });

  const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      console.log("PATIENTS:", data);
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      alert("Error loading patients");
    }
  };

  const submitAppointment = async () => {
    if (!form.patient_id || !form.date) {
      alert("Select patient and date");
      return;
    }

    const payload = {
      patient_id: Number(form.patient_id),
      doctor_id: Number(doctorId),
      date: new Date(form.date).toISOString(),
    };

    try {
      const res = await addAppointment(payload);
      console.log("APPOINTMENT:", res);

      alert("Appointment created");

      setForm({ patient_id: "", date: "" });
    } catch (err) {
      console.log(err);
      alert("Failed to create appointment");
    }
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
            {p.name} - {p.phone} (ID: {p.id})
          </option>
        ))}
      </select>

      <br /><br />

      {/* DATE */}
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