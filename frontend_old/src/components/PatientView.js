import { useEffect, useState } from "react";
import { getAppointments } from "../api";

export default function PatientView() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAppointments();

    if (res.success) {
      setAppointments(res.data); // ✅ FIX HERE
    } else {
      setAppointments([]); // fallback
    }
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>

      <h3>Your Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id}>
            {new Date(a.date).toLocaleString()}
          </div>
        ))
      )}
    </div>
  );
}