import React, { useState } from "react";
import { loginUser } from "../api.js";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await loginUser(form);

      alert(res.message);

      localStorage.setItem("userId", res.user_id);

      navigate("/doctor");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button onClick={submit}>Login</button>

      {/* ✅ REGISTER LINK (CORRECT PLACE) */}
      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}