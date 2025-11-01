// src/components/Admin/AdminLogin.js
import React, { useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(api('/api/admin/login'), {
        email,
        password
      });

      // Store JWT token in localStorage
      localStorage.setItem("adminToken", res.data.token);

      // Optionally store admin info
      localStorage.setItem("adminName", res.data.admin.name);

      // Redirect to dashboard
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-card">
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="admin-login-input" required />
        </div>

        <div>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="admin-login-input" required />
        </div>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        <button type="submit" disabled={loading} className="admin-login-btn">{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
}
