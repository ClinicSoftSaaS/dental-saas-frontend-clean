export default function Sidebar({ setPage }) {
  return (
    <div style={{
      width: "220px",
      background: "#2c3e50",
      color: "white",
      height: "100vh",
      padding: "20px"
    }}>

      <h2 style={{ marginBottom: "20px" }}>ClinicSoft</h2>

      <button style={btn} onClick={() => setPage("dashboard")}>
        Dashboard
      </button>

      <button style={btn} onClick={() => setPage("patients")}>
        Patients
      </button>

      <button style={btn} onClick={() => setPage("appointments")}>
        Appointments
      </button>

      <button style={btn} onClick={() => setPage("prescription")}>
        Prescription
      </button>

      <button style={btn} onClick={() => setPage("search")}>
        Search
      </button>
    </div>
  );
}

const btn = {
  width: "100%",
  padding: "10px",
  margin: "5px 0",
  background: "transparent",
  color: "white",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer"
};