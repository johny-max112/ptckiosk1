import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function AdminAbout() {
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

  const getCharCount = (text) => text ? text.length : 0;
  const getWordCount = (text) => text ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0;

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "900px", 
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: "center",
          marginBottom: "40px",
          borderBottom: "3px solid #007bff",
          paddingBottom: "20px"
        }}>
          <h1 style={{ 
            color: "#2c3e50", 
            margin: "0",
            fontSize: "2.5em",
            fontWeight: "300"
          }}>
            🏫 Manage About PTC
          </h1>
          <p style={{ 
            color: "#6c757d", 
            margin: "10px 0 0 0",
            fontSize: "1.1em"
          }}>
            Update institutional information displayed to kiosk users
          </p>
        </div>

        {loading && (
          <div style={{ 
            textAlign: "center", 
            padding: "20px",
            color: "#007bff",
            fontSize: "1.1em"
          }}>
            Loading...
          </div>
        )}

        {/* Save Status */}
        {saveStatus && (
          <div style={{
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: saveStatus.includes("✅") ? "#d4edda" : 
                           saveStatus.includes("❌") ? "#f8d7da" : "#fff3cd",
            border: `1px solid ${saveStatus.includes("✅") ? "#c3e6cb" : 
                                saveStatus.includes("❌") ? "#f5c6cb" : "#ffeaa7"}`,
            color: saveStatus.includes("✅") ? "#155724" : 
                   saveStatus.includes("❌") ? "#721c24" : "#856404",
            textAlign: "center",
            fontWeight: "500"
          }}>
            {saveStatus}
          </div>
        )}
        
        {/* Mission Section */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "10px"
          }}>
            <label style={{ 
              display: "block", 
              fontWeight: "bold",
              color: "#2c3e50",
              fontSize: "1.2em"
            }}>
              🎯 Mission Statement
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.mission)} words, {getCharCount(about.mission)} characters
            </small>
          </div>
          <textarea
            name="mission"
            value={about.mission}
            placeholder="Enter PTC's mission statement - what the institution aims to achieve and its core purpose..."
            onChange={handleChange}
            rows={5}
            style={{ 
              width: "100%", 
              padding: "15px", 
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "1em",
              lineHeight: "1.5",
              resize: "vertical",
              fontFamily: "inherit",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#007bff"}
            onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
          />
        </div>

        {/* Vision Section */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "10px"
          }}>
            <label style={{ 
              display: "block", 
              fontWeight: "bold",
              color: "#2c3e50",
              fontSize: "1.2em"
            }}>
              🔮 Vision Statement
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.vision)} words, {getCharCount(about.vision)} characters
            </small>
          </div>
          <textarea
            name="vision"
            value={about.vision}
            placeholder="Enter PTC's vision statement - the institution's aspirations and future goals..."
            onChange={handleChange}
            rows={5}
            style={{ 
              width: "100%", 
              padding: "15px", 
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "1em",
              lineHeight: "1.5",
              resize: "vertical",
              fontFamily: "inherit",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#28a745"}
            onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
          />
        </div>

        {/* History Section */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "10px"
          }}>
            <label style={{ 
              display: "block", 
              fontWeight: "bold",
              color: "#2c3e50",
              fontSize: "1.2em"
            }}>
              📚 History & Background
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.history)} words, {getCharCount(about.history)} characters
            </small>
          </div>
          <textarea
            name="history"
            value={about.history}
            placeholder="Enter PTC's history - founding, milestones, achievements, and development over the years..."
            onChange={handleChange}
            rows={8}
            style={{ 
              width: "100%", 
              padding: "15px", 
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "1em",
              lineHeight: "1.5",
              resize: "vertical",
              fontFamily: "inherit",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#ffc107"}
            onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
          />
        </div>

        {/* Save Button */}
        <div style={{ textAlign: "center" }}>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{ 
              padding: "15px 40px", 
              backgroundColor: loading ? "#6c757d" : "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "50px",
              fontSize: "1.1em",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0,123,255,0.3)"
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(0,123,255,0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,123,255,0.3)";
              }
            }}
          >
            {loading ? "💾 Saving..." : "💾 Save About Information"}
          </button>
        </div>

        {/* Help Text */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          border: "1px solid #e9ecef"
        }}>
          <h4 style={{ color: "#495057", marginBottom: "10px" }}>💡 Tips for Writing Effective Content:</h4>
          <ul style={{ color: "#6c757d", lineHeight: "1.6", paddingLeft: "20px" }}>
            <li><strong>Mission:</strong> Keep it concise and focused on your institution's purpose</li>
            <li><strong>Vision:</strong> Describe your aspirations and future goals</li>
            <li><strong>History:</strong> Include founding date, key milestones, and achievements</li>
            <li>Use clear, professional language that represents your institution well</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminAbout;