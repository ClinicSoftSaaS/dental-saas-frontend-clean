import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function PatientView() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const userId = user?.id;

  // =========================
  // LOAD PATIENTS
  // =========================
  const loadPatients = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients/`);
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];

      setPatients(list);
      setFilteredPatients(list);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (role === "patient") {
        const res = await fetch(`${BASE_URL}/api/patients/search/id/${userId}`);
        const data = await res.json();
        setPatients([data]);
        setFilteredPatients([data]);
      } else {
        loadPatients();
      }
    };

    init();
  }, []);

  // =========================
  // SEARCH BY PHONE
  // =========================
  const handleSearch = () => {
    if (!search) {
      setFilteredPatients(patients);
      return;
    }

    const result = patients.filter((p) =>
      String(p.phone).includes(search)
    );

    setFilteredPatients(result);
  };

  // =========================
  // ADD PATIENT
  // =========================
  const addPatient = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          age: Number(form.age)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Error adding patient");
        return;
      }

      alert("Patient added");

      setForm({ name: "", phone: "", age: "" });
      loadPatients();

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOAD DETAILS
  // =========================
  const loadPatientDetails = async (patient) => {
    setSelectedPatient(patient);

    try {
      const aRes = await fetch(`${BASE_URL}/api/appointments/`);
      const aData = await aRes.json();

      setAppointments(
        (Array.isArray(aData) ? aData : [])
          .filter(a => Number(a.patient_id) === Number(patient.id))
      );

      const pRes = await fetch(`${BASE_URL}/api/prescriptions/`);
      const pData = await pRes.json();

      setPrescriptions(
        (Array.isArray(pData) ? pData : [])
          .filter(p => Number(p.patient_id) === Number(patient.id))
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>🧑‍⚕️ Patients</h2>

      {/* ================= SEARCH ================= */}
      {role === "doctor" && !selectedPatient && (
        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Search by phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>
      )}

      {/* ================= ADD PATIENT ================= */}
      {role === "doctor" && !selectedPatient && (
        <div style={{
          background: "#f4f6f8",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}>
          <h3>➕ Add Patient</h3>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="Age"
            value={form.age}
            onChange={(e) =>
              setForm({ ...form, age: e.target.value })
            }
          />

          <button onClick={addPatient}>
            Add Patient
          </button>
        </div>
      )}

      {/* ================= LIST ================= */}
      {!selectedPatient && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px"
        }}>
          {filteredPatients.length === 0 ? (
            <p>No patients found</p>
          ) : (
            filteredPatients.map((p) => (
              <div key={p.id} style={{
                background: "linear-gradient(135deg, #2c3e50, #34495e)",
                color: "white",
                padding: "15px",
                borderRadius: "12px"
              }}>
                <h3>👤 {p.name}</h3>
                <p>📞 {p.phone}</p>
                <p>🎂 Age: {p.age}</p>

                <button
                  onClick={() => loadPatientDetails(p)}
                  style={{ marginTop: "10px" }}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= DETAILS ================= */}
      {selectedPatient && (
        <div>
          <button onClick={() => setSelectedPatient(null)}>
            ← Back
          </button>

          <h2>{selectedPatient.name}</h2>

          <h3>📅 Appointments</h3>
          {appointments.map(a => (
            <div key={a.id}>
              🗓 {a.date}
            </div>
          ))}

          <h3>💊 Prescriptions</h3>
          {[...prescriptions]
            .sort((a, b) => b.id - a.id)
            .map(p => (
              <div key={p.id}>
                💊 {p.medicines}
                <br />
                📝 {p.notes}
              </div>
            ))
          }
        </div>
      )}

    </div>
  );
}