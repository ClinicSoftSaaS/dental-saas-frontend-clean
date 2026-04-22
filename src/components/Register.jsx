import React from "react";
import { useState } from "react";
import { registerUser } from "../api.js";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: ""
  });

  const submit = async () => {
    if (!form.username || !form.password || !form.role) {
      alert("All fields required");
      return;
    }

    const res = await registerUser(form);

    if (res.success) {
      alert(res.data?.message || "Registration successful");
      setForm({ username: "", password: "", role: "" });
    } else {
      alert(res.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="">Select Role</option>
        <option value="doctor">Doctor</option>
        <option value="patient">Patient</option>
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}