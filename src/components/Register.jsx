import { useState } from "react";
import { registerUser } from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "patient"
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.username || !form.password) {
      alert("Username and Password are required");
      return;
    }

    try {
      setLoading(true);

      await registerUser(form);

      alert("User created successfully!");

      // reset form
      setForm({
        username: "",
        password: "",
        role: "patient"
      });

    } catch (err) {
      console.log(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>

      <input
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <select
        style={styles.input}
        value={form.role}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      <button
        style={styles.button}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creating..." : "Register"}
      </button>
    </div>
  );
}

// =====================
// STYLES
// =====================
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  title: {
    marginBottom: "10px",
    textAlign: "center"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};