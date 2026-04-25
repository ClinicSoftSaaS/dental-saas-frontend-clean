import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        // =========================
        // GET PATIENT INFO
        // =========================
        const res = await fetch(
          `${BASE_URL}/api/patients/search/id/${userId}`
        );
        const data = await res.json();
        setPatient(data);

        // =========================
        // GET APPOINTMENTS
        // =========================
        const apptRes = await fetch(`${BASE_URL}/api/appointments`);
        const apptData = await apptRes.json();

        setAppointments(
          apptData.filter((a) => a.patient_id === userId)
        );

        // =========================
        // GET PRESCRIPTIONS
        // =========================
        const presRes = await fetch(`${BASE_URL}/api/prescriptions/`);
        const presData = await presRes.json();

        setPrescriptions(
          presData.filter((p) => p.patient_id === userId)
        );

      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  if (!patient) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>👤 My Dashboard</h2>

      {/* =========================
          PATIENT INFO
      ========================= */}
      <div style={{
        background: "#2c3e50",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <h3>{patient.name}</h3>
        <p>📞 {patient.phone}</p>
        <p>🎂 Age: {patient.age}</p>
      </div>

      {/* =========================
          APPOINTMENTS
      ========================= */}
      <h3>📅 My Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id} style={{
            background: "#34495e",
            color: "white",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}>
            📆 {new Date(a.date).toLocaleString()}
          </div>
        ))
      )}

      {/* =========================
          PRESCRIPTIONS
      ========================= */}
      <h3>💊 My Prescriptions</h3>

      {prescriptions.length === 0 ? (
        <p>No prescriptions</p>
      ) : (
        prescriptions.map((p) => (
          <div key={p.id} style={{
            background: "#1f2a36",
            color: "white",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}>
            💊 {p.medicines}
            <br />
            📝 {p.notes}
          </div>
        ))
      )}

    </div>
  );
}