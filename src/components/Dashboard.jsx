import { useEffect, useState } from "react";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/patients`)
      .then((res) => res.json())
      .then((data) => setPatients(data));

    fetch(`${BASE_URL}/api/appointments`)
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  }, []);

  const cardStyle = {
    background: "linear-gradient(135deg, #2c3e50, #34495e)",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    flex: 1,
    minWidth: "200px"
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>
        📊 Dashboard
      </h2>

      {/* CARDS */}
      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
      }}>

        {/* PATIENTS CARD */}
        <div style={cardStyle}>
          <h3>👤 Patients</h3>
          <h1>{patients.length}</h1>
        </div>

        {/* APPOINTMENTS CARD */}
        <div style={cardStyle}>
          <h3>📅 Appointments</h3>
          <h1>{appointments.length}</h1>
        </div>

        {/* OPTIONAL EXTRA CARD */}
        <div style={cardStyle}>
          <h3>🧾 Prescriptions</h3>
          <h1>--</h1>
        </div>

      </div>
    </div>
  );
}