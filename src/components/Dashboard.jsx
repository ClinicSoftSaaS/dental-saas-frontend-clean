import React from "react";
import { useEffect, useState } from "react";
import {
  getPatients,
  addPatient,
  getAppointments,
  addAppointment
} from "../api.js";

import Sidebar from "./Sidebar";
import Search from "./Search";
import Prescription from "./Prescription";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Dashboard() {
  const [page, setPage] = useState("dashboard");

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [patientForm, setPatientForm] = useState({
    name: "",
    phone: "",
    age: ""
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patient_id: "",
    date: ""
  });

  const [searchPatientId, setSearchPatientId] = useState("");

  const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const patientsData = await getPatients();
      const appointmentsData = await getAppointments();

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      console.log(err);
      setPatients([]);
      setAppointments([]);
    }
  };

 const handleAddPatient = async () => {
  if (!patientForm.name || !patientForm.phone) {
    alert("Name and phone required");
    return;
  }

  // ✅ prevent duplicate phone
  const exists = patients.find(p => p.phone === patientForm.phone);
  if (exists) {
    alert("Patient with this phone already exists");
    return;
  }

  try {
    await addPatient({
      name: patientForm.name,
      phone: patientForm.phone,
      age: Number(patientForm.age)
    });

    setPatientForm({ name: "", phone: "", age: "" });
    loadData();

  } catch (err) {
    alert(err.message || "Failed to add patient");
  }
};

  const handleAddAppointment = async () => {
  if (!appointmentForm.patient_id || !appointmentForm.date) {
    alert("Select patient and date");
    return;
  }

  try {
    await addAppointment({
      patient_id: Number(appointmentForm.patient_id),
      doctor_id: Number(doctorId),
      date: new Date(appointmentForm.date).toISOString()
    });

    setAppointmentForm({ patient_id: "", date: "" });
    loadData();

  } catch (err) {
    alert(err.message || "Failed to add appointment");
  }
};

  const filteredAppointments = searchPatientId
    ? appointments.filter(a => a.patient_id === Number(searchPatientId))
    : appointments;

  const handlePrint = () => window.print();

  const handleDownloadPDF = async (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("report.pdf");
  };

  return (
    <div style={styles.wrapper}>

      {/* SIDEBAR */}
      <Sidebar setPage={setPage} />

      {/* MAIN */}
      <div style={styles.main}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div style={styles.page}>
            <h1 style={styles.title}>Dashboard</h1>

            <div style={styles.grid}>
              <div style={styles.card}>
                <h3>Total Patients</h3>
                <p style={styles.number}>{patients.length}</p>
              </div>

              <div style={styles.card}>
                <h3>Appointments</h3>
                <p style={styles.number}>{appointments.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* PATIENTS */}
        {page === "patients" && (
          <div style={styles.page}>
            <h1 style={styles.title}>Patients</h1>

            <div style={styles.formGrid}>
              <input
                style={styles.input}
                placeholder="Name"
                value={patientForm.name}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, name: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Phone"
                value={patientForm.phone}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, phone: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Age"
                value={patientForm.age}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, age: e.target.value })
                }
              />
            </div>

            <button style={styles.btnBlue} onClick={handleAddPatient}>
              Add Patient
            </button>

            <div style={styles.actions}>
              <button style={styles.btnDark} onClick={handlePrint}>
                Print
              </button>

              <button
                style={styles.btnGreen}
                onClick={() => handleDownloadPDF("patients-section")}
              >
                Download PDF
              </button>
            </div>

            <div id="patients-section" style={styles.list}>
              {patients.map((p) => (
                <div key={p.id} style={styles.item}>
                  ID: {p.id} | {p.name} | {p.phone} | Age: {p.age}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {page === "appointments" && (
          <div style={styles.page}>
            <h1 style={styles.title}>Appointments</h1>

            <div style={styles.formRow}>
              <select
                style={styles.input}
                value={appointmentForm.patient_id}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    patient_id: e.target.value
                  })
                }
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                style={styles.input}
                value={appointmentForm.date}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    date: e.target.value
                  })
                }
              />

              <button style={styles.btnBlue} onClick={handleAddAppointment}>
                Add
              </button>
            </div>

            <input
              style={styles.input}
              placeholder="Filter by Patient ID"
              value={searchPatientId}
              onChange={(e) => setSearchPatientId(e.target.value)}
            />

            <div style={styles.actions}>
              <button style={styles.btnDark} onClick={handlePrint}>
                Print
              </button>

              <button
                style={styles.btnGreen}
                onClick={() => handleDownloadPDF("appointments-section")}
              >
                Download PDF
              </button>
            </div>

            <div id="appointments-section" style={styles.list}>
              {filteredAppointments.map((a) => (
                <div key={a.id} style={styles.item}>
                  Patient ID: {a.patient_id} |{" "}
                  {new Date(a.date).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER TABS */}
        {page === "search" && <Search />}
        {page === "prescription" && <Prescription patients={patients} />}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f3f4f6"
  },

  main: {
    flex: 1,
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  page: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  title: {
    fontSize: "24px",
    fontWeight: "bold"
  },

  grid: {
    display: "flex",
    gap: "20px"
  },

  /* ✅ MODERN CARD STYLE */
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    minWidth: "180px"
  },

  number: {
    fontSize: "28px",
    fontWeight: "bold"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px"
  },

  formRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  /* ✅ MODERN ITEM CARD */
  item: {
    background: "#fff",
    padding: "12px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
  },

  actions: {
    display: "flex",
    gap: "10px"
  },

  btnBlue: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  btnGreen: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  btnDark: {
    background: "#111827",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};