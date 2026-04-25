import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Search() {
  const [phone, setPhone] = useState("");
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // ================= STYLE =================
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
    borderRadius: "12px",
    marginTop: "20px"
  };

  // ================= SEARCH =================
  const handleSearch = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients`);
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];

      // 🔥 FIX: get ALL patients with same phone
      const matches = list.filter(
        (p) => String(p.phone).trim() === phone.trim()
      );

      if (matches.length === 0) {
        alert("Patient not found");
        setPatients([]);
        setPatient(null);
        setAppointments([]);
        setPrescriptions([]);
        return;
      }

      setPatients(matches);

      // auto-select first patient (safe default)
      const selected = matches[0];
      setPatient(selected);

      // ================= APPOINTMENTS =================
      const aRes = await fetch(`${BASE_URL}/api/appointments`);
      const aData = await aRes.json();

      const appointmentsList = Array.isArray(aData) ? aData : [];

     const filteredAppointments = appointmentsList.filter((a) => {
  const pid = a.patient_id;
  const sid = selected?.id;

  return pid !== undefined && sid !== undefined && Number(pid) === Number(sid);
});

      setAppointments(filteredAppointments);

      // ================= PRESCRIPTIONS =================
      const pRes = await fetch(`${BASE_URL}/api/prescriptions`);
      const pData = await pRes.json();

      const prescriptionsList = Array.isArray(pData) ? pData : [];

      const filteredPrescriptions = prescriptionsList.filter(
        (p) => Number(p.patient_id) === Number(selected.id)
      );

      setPrescriptions(filteredPrescriptions);

    } catch (err) {
      console.log("Server error:", err);
      alert("Server error");
    }
  };

  // ================= SELECT PATIENT =================
  const selectPatient = async (p) => {
    setPatient(p);

    // reload appointments for selected patient
    const aRes = await fetch(`${BASE_URL}/api/appointments`);
    const aData = await aRes.json();

    const appointmentsList = Array.isArray(aData) ? aData : [];

    setAppointments(
      appointmentsList.filter(
        (a) => Number(a.patient_id) === Number(p.id)
      )
    );

    // reload prescriptions
    const pRes = await fetch(`${BASE_URL}/api/prescriptions`);
    const pData = await pRes.json();

    const prescriptionsList = Array.isArray(pData) ? pData : [];

    setPrescriptions(
      prescriptionsList.filter(
        (x) => Number(x.patient_id) === Number(p.id)
      )
    );
  };

  // ================= PRINT =================
  const handlePrint = () => {
    window.print();
  };

  // ================= DOWNLOAD =================
  const handleDownload = () => {
    if (!patient) return;

    const text =
      "Patient Report\n\n" +
      "Name: " + patient.name + "\n" +
      "Phone: " + patient.phone + "\n" +
      "Age: " + patient.age + "\n\n" +
      "Appointments:\n" +
      appointments.map((a) => "- " + a.date).join("\n") +
      "\n\nPrescriptions:\n" +
      prescriptions.map((p) => "- " + p.medicines).join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "patient_report.txt";
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ color: "#2c3e50" }}>🔍 Search Patient</h2>

      <input
        style={inputStyle}
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button style={buttonStyle} onClick={handleSearch}>
        Search
      </button>

      {/* ================= MULTIPLE PATIENTS ================= */}
      {patients.length > 1 && (
        <div style={{ marginTop: "15px" }}>
          <h3>Select Patient:</h3>

          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => selectPatient(p)}
              style={{
                padding: "8px",
                margin: "5px 0",
                background: "#eee",
                cursor: "pointer",
                borderRadius: "6px"
              }}
            >
              {p.name} - {p.phone} (ID: {p.id})
            </div>
          ))}
        </div>
      )}

      {/* ================= PATIENT INFO ================= */}
      {patient && (
        <div style={cardStyle}>

          <h3>👤 Patient</h3>
          <p>Name: {patient.name}</p>
          <p>Phone: {patient.phone}</p>
          <p>Age: {patient.age}</p>

          <button style={buttonStyle} onClick={handlePrint}>
            🖨 Print
          </button>

          <button style={buttonStyle} onClick={handleDownload}>
            📄 Download
          </button>

          <h3 style={{ marginTop: "15px" }}>📅 Appointments</h3>

          {appointments.length === 0 ? (
            <p>No appointments</p>
          ) : (
            appointments.map((a) => (
              <div key={a.id}>
                🗓 {new Date(a.date).toLocaleString()}
              </div>
            ))
          )}

          <h3 style={{ marginTop: "15px" }}>💊 Prescriptions</h3>

          {prescriptions.length === 0 ? (
            <p>No prescriptions</p>
          ) : (
            prescriptions.map((p) => (
              <div key={p.id}>
                💊 {p.medicines}
                <br />
                📝 {p.notes}
              </div>
            ))
          )}

        </div>
      )}

    </div>
  );
}