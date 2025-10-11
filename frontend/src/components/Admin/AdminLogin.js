// src/components/Admin/AdminLogin.js
import React, { useState } from "react";
import axios from "axios";

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
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/admin/login`, {
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
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center", padding: "30px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
            required
          />
        </div>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
