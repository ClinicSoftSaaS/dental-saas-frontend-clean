import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Login({ setPage }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // =========================
      // SAFE USER PARSING (NO BACKEND CHANGE NEEDED)
      // =========================
      const user =
        data?.user ||   // if backend returns {user: {...}}
        data?.data ||   // fallback structure
        data;           // direct user object

      if (!user || (!user.id && !user.user_id)) {
        alert("Login error: invalid user data received");
        console.log("INVALID LOGIN DATA:", data);
        return;
      }

      // normalize user object
      const cleanUser = {
        id: user.id || user.user_id,
        username: user.username,
        role: user.role || "doctor",
      };

      // store safely
      localStorage.setItem("user", JSON.stringify(cleanUser));

      console.log("CLEAN USER STORED:", cleanUser);

      alert("Login successful");

      // navigation
      if (setPage) {
        setPage("dashboard");
      } else {
        window.location.href = "/app";
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f4f6f9"
    }}>

      <div style={{
        width: "350px",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don't have an account?{" "}
          <button onClick={() => window.location.href = "/register"}>
            Register
          </button>
        </p>

      </div>
    </div>
  );
}