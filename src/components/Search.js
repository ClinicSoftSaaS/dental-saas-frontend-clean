import { useState } from "react";
import {
  searchPatientByPhone,
  getAppointments,
  getPrescriptions
} from "../api";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Search() {
  const [phone, setPhone] = useState("");
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const handleSearch = async () => {
    try {
      const p = await searchPatientByPhone(phone);
      setPatient(p);

      // GET ALL APPOINTMENTS THEN FILTER
      const allAppointments = await getAppointments();
      const filteredAppointments = Array.isArray(allAppointments)
        ? allAppointments.filter(a => a.patient_id === p.id)
        : [];

      setAppointments(filteredAppointments);

      // GET PRESCRIPTIONS
      const pres = await getPrescriptions(p.id);
      setPrescriptions(Array.isArray(pres) ? pres : []);
    } catch (err) {
      alert(err.message);
      setPatient(null);
      setAppointments([]);
      setPrescriptions([]);
    }
  };

  // PRINT
  const handlePrint = () => {
    window.print();
  };

  // PDF DOWNLOAD
  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-section");

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("patient-report.pdf");
  };

  return (
    <div>
      <h2>Search Patient</h2>

      <input
        placeholder="Enter phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {/* ACTION BUTTONS */}
      {patient && (
        <div style={{ marginTop: "10px" }}>
          <button onClick={handlePrint}>Print</button>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      )}

      {/* REPORT SECTION */}
      {patient && (
        <div id="report-section" style={{ marginTop: "20px" }}>

          {/* PATIENT */}
          <h3>Patient Info</h3>
          <p>Name: {patient.name}</p>
          <p>Phone: {patient.phone}</p>
          <p>Age: {patient.age}</p>

          {/* APPOINTMENTS */}
          <h3>Appointments</h3>
          {appointments.length > 0 ? (
            appointments.map(a => (
              <div key={a.id}>
                {new Date(a.date).toLocaleString()}
              </div>
            ))
          ) : (
            <p>No appointments found</p>
          )}

          {/* PRESCRIPTIONS */}
          <h3>Prescriptions</h3>
          {prescriptions.length > 0 ? (
            prescriptions.map(pr => (
              <div key={pr.id}>
                <p>Medicines: {pr.medicines}</p>
                <p>Notes: {pr.notes}</p>
                <p>Date: {new Date(pr.date).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No prescriptions found</p>
          )}

        </div>
      )}
    </div>
  );
}