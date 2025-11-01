import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./AdminAbout.css";

function AdminAbout() {
  const navigate = useNavigate();
  const [about, setAbout] = useState({ mission: "", vision: "", history: "" });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/about", {
        headers: getAuthHeaders()
      });
      if (res.data) setAbout(res.data);
    } catch (error) {
      console.error("Error fetching about info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        setSaveStatus("Error loading data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleChange = (e) => {
    setAbout({ ...about, [e.target.name]: e.target.value });
    setSaveStatus(""); // Clear status when user types
  };

  const handleSave = async () => {
    if (!about.mission && !about.vision && !about.history) {
      setSaveStatus("Please fill at least one field");
      return;
    }

    try {
      setLoading(true);
      setSaveStatus("Saving...");

      if (about.id) {
        await axios.put("http://localhost:5000/api/admin/about", about, {
          headers: getAuthHeaders()
        });
      } else {
        await axios.post("http://localhost:5000/api/admin/about", about, {
          headers: getAuthHeaders()
        });
      }

      setSaveStatus("✅ Saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
      fetchAbout();
    } catch (error) {
      console.error("Error saving about info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        setSaveStatus("❌ Error saving. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getCharCount = (text) => (text ? text.length : 0);
  const getWordCount = (text) =>
    text ? text.trim().split(/\s+/).filter((word) => word.length > 0).length : 0;

  return (
    <div className="admin-page-about">
      <div
        className="admin-bg-about"
        style={{ backgroundImage: "url('/pateros.png')" }}
      />

      <div className="admin-card-about">
        <div className="admin-back-container">
          <button onClick={() => navigate('/admin/dashboard')} className="btn-about admin-back-btn">← Back to Dashboard</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 style={{ margin: 0 }}>Manage About PTC</h1>
          <p style={{ color: "#2e7d32", margin: "6px 0 0 0", fontSize: "1.1em" }}>
            Update institutional information displayed to kiosk users
          </p>
        </div>

        {loading && (
          <div className="header" style={{ padding: "20px", color: "#007bff", fontSize: "1.1em" }}>
            Loading...
          </div>
        )}

        {saveStatus && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: saveStatus.includes("✅") ? "#d4edda" : saveStatus.includes("❌") ? "#f8d7da" : "#fff3cd",
              border: `1px solid ${saveStatus.includes("✅") ? "#c3e6cb" : saveStatus.includes("❌") ? "#f5c6cb" : "#ffeaa7"}`,
              color: saveStatus.includes("✅") ? "#155724" : saveStatus.includes("❌") ? "#721c24" : "#856404",
              textAlign: "center",
              fontWeight: "500"
            }}
          >
            {saveStatus}
          </div>
        )}

        {/* Mission Section */}
        <div className="admin-form-about">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#2c3e50", fontSize: "1.2em" }}>
              Mission Statement
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.mission)} words, {getCharCount(about.mission)} characters
            </small>
          </div>

          <textarea
            name="mission"
            className="input-about"
            value={about.mission}
            placeholder="Enter PTC's mission statement - what the institution aims to achieve and its core purpose..."
            onChange={handleChange}
            rows={5}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
          />
        </div>

        {/* Vision Section */}
        <div className="admin-form-about">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#2c3e50", fontSize: "1.2em" }}>
              Vision Statement
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.vision)} words, {getCharCount(about.vision)} characters
            </small>
          </div>

          <textarea
            name="vision"
            className="input-about"
            value={about.vision}
            placeholder="Enter PTC's vision statement - the institution's aspirations and future goals..."
            onChange={handleChange}
            rows={5}
            onFocus={(e) => (e.target.style.borderColor = "#28a745")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
          />
        </div>

        {/* History Section */}
        <div className="admin-form-about" style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#2c3e50", fontSize: "1.2em" }}>
              History & Background
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.history)} words, {getCharCount(about.history)} characters
            </small>
          </div>

          <textarea
            name="history"
            className="input-about"
            value={about.history}
            placeholder="Enter PTC's history - founding, milestones, achievements, and development over the years..."
            onChange={handleChange}
            rows={8}
            onFocus={(e) => (e.target.style.borderColor = "#ffc107")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
          />
        </div>

        {/* Save Button */}
        <div style={{ textAlign: "center" }}>
          <button
            className="btn-about primary"
            onClick={handleSave}
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Saving..." : "Save About Information"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAbout;