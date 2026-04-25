import { useState } from "react";

import Dashboard from "./Dashboard";
import DoctorPatients from "./DoctorPatients";
import Appointments from "./Appointments";
import Prescription from "./Prescription";
import Search from "./Search";

import PatientDashboard from "./PatientDashboard";

export default function MainLayout() {
  const [page, setPage] = useState("dashboard");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // =========================
  // PATIENT VIEW (LOCKED)
  // =========================
  if (role === "patient") {
    return <PatientDashboard />;
  }

  // =========================
  // DOCTOR VIEW
  // =========================
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;

      case "patients":
        return <DoctorPatients />;

      case "appointments":
        return <Appointments />;

      case "prescription":
        return <Prescription />;

      case "search":
        return <Search />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>

      {/* =========================
          SIDEBAR (DOCTOR ONLY)
      ========================= */}
      <div style={{
        width: "220px",
        background: "#2c3e50",
        color: "white",
        height: "100vh",
        padding: "15px"
      }}>

        <h3>ClinicSoft</h3>

        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <br /><br />

        <button onClick={() => setPage("patients")}>Patients</button>
        <br /><br />

        <button onClick={() => setPage("appointments")}>Appointments</button>
        <br /><br />

        <button onClick={() => setPage("prescription")}>Prescriptions</button>
        <br /><br />

        <button onClick={() => setPage("search")}>Search</button>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div style={{ flex: 1, padding: "20px" }}>
        {renderPage()}
      </div>

    </div>
  );
}