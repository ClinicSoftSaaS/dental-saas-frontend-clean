import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    date: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // STYLES (same as patient page)
  // =========================
  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    padding: "10px 15px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#2c3e50",
    color: "white"
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #2c3e50, #34495e)",
    color: "white",
    padding: "15px",
    borderRadius: "12px"
  };

  // =========================
  // LOAD APPOINTMENTS
  // =========================
  const loadAppointments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/`);
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];

      setAppointments(list);
      setFilteredAppointments(list);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // =========================
  // SEARCH (by patient id)
  // =========================
  const handleSearch = () => {
    if (!search) {
      setFilteredAppointments(appointments);
      return;
    }

    const result = appointments.filter((a) =>
      String(a.patient_id).includes(search)
    );

    setFilteredAppointments(result);
  };

  // =========================
  // ADD APPOINTMENT
  // =========================
  const addAppointment = async () => {
    if (!form.patient_id || !form.date) {
      alert("Please fill required fields");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patient_id: Number(form.patient_id),
          doctor_id: user?.id,
          date: form.date
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Error adding appointment");
        return;
      }

      alert("Appointment added");

      setForm({
        patient_id: "",
        doctor_id: "",
        date: ""
      });

      loadAppointments();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ color: "#2c3e50" }}>
        📅 Appointments
      </h2>

      {/* ================= SEARCH ================= */}
      <div style={{ marginBottom: "20px" }}>
        <input
          style={inputStyle}
          placeholder="Search by Patient ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button style={buttonStyle} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* ================= ADD FORM ================= */}
      <div style={{
        background: "#f4f6f8",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <h3>➕ Add Appointment</h3>

        <input
          style={inputStyle}
          placeholder="Patient ID"
          value={form.patient_id}
          onChange={(e) =>
            setForm({ ...form, patient_id: e.target.value })
          }
        />

        <input
          style={inputStyle}
          type="datetime-local"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <button style={buttonStyle} onClick={addAppointment}>
          Add Appointment
        </button>
      </div>

      {/* ================= CARDS ================= */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "15px"
      }}>
        {filteredAppointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          filteredAppointments.map((a) => (
            <div key={a.id} style={cardStyle}>
              <h3>🗓 Appointment #{a.id}</h3>

              <p>👤 Patient ID: {a.patient_id}</p>
              <p>🧑‍⚕️ Doctor ID: {a.doctor_id}</p>

              <div style={{
                marginTop: "10px",
                padding: "8px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)"
              }}>
                📆 {new Date(a.date).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}