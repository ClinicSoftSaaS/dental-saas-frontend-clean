export default function Sidebar({ setPage }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>🦷 Dental SaaS</h2>

      <div style={styles.menu}>

        <button style={styles.button} onClick={() => setPage("dashboard")}>
          Dashboard
        </button>

        <button style={styles.button} onClick={() => setPage("patients")}>
          Patients
        </button>

        <button style={styles.button} onClick={() => setPage("appointments")}>
          Appointments
        </button>

        <button style={styles.button} onClick={() => setPage("search")}>
          Search
        </button>

        <button style={styles.button} onClick={() => setPage("prescription")}>
          Prescription
        </button>

      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    backgroundColor: "#4c1d95", // purple (like your old UI)
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "30px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  button: {
    textAlign: "left",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#4c1d95",
    fontWeight: "600",
  },
};