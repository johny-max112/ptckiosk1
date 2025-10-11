import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function AdminAbout() {
  const [about, setAbout] = useState({ mission: "", vision: "", history: "" });
  const [loading, setLoading] = useState(false);

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
        alert("Error fetching about info. Please try again.");
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
  };

  const handleSave = async () => {
    if (!about.mission && !about.vision && !about.history) {
      return alert("Please fill at least one field");
    }

    try {
      setLoading(true);
      if (about.id) {
        await axios.put("http://localhost:5000/api/admin/about", about, {
          headers: getAuthHeaders()
        });
        alert("About info updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/admin/about", about, {
          headers: getAuthHeaders()
        });
        alert("About info created successfully!");
      }
      fetchAbout();
    } catch (error) {
      console.error("Error saving about info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error saving about info. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🏫 Manage About PTC</h2>
      
      {loading && <p>Loading...</p>}
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Mission Statement:
        </label>
        <textarea
          name="mission"
          value={about.mission}
          placeholder="Enter PTC's mission statement..."
          onChange={handleChange}
          rows={4}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Vision Statement:
        </label>
        <textarea
          name="vision"
          value={about.vision}
          placeholder="Enter PTC's vision statement..."
          onChange={handleChange}
          rows={4}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          History:
        </label>
        <textarea
          name="history"
          value={about.history}
          placeholder="Enter PTC's history..."
          onChange={handleChange}
          rows={6}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        style={{ 
          padding: "12px 24px", 
          backgroundColor: "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "5px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Saving..." : "Save About Info"}
      </button>
    </div>
  );
}

export default AdminAbout;