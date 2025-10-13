import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function AdminOffices() {
  const [offices, setOffices] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [form, setForm] = useState({
    campus_id: "",
    name: "",
    description: "",
    contact: "",
    office_hours: ""
  });
  // PTC color palette and card style
  const backgroundStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #e8f5e9 0%, #fffde7 100%)",
    opacity: 0.22,
    zIndex: 1,
    pointerEvents: "none"
  };
  const cardStyle = {
    background: "linear-gradient(135deg, #fffde7 0%, #ffffff 100%)",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
    padding: "40px 32px 32px 32px",
    maxWidth: "900px",
    margin: "60px auto 0 auto",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    border: "3px solid #ffc107"
  };
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchOffices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/offices", {
        headers: getAuthHeaders()
      });
      setOffices(res.data);
    } catch (error) {
      console.error("Error fetching offices:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
  // Use cardStyle for main container and update header/button colors to match PTC palette
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCampuses = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/campuses", {
        headers: getAuthHeaders()
      });
      console.log("Fetched campuses:", res.data); // Debug log
      setCampuses(res.data);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      // Set proper PTC campus names as fallback
      console.log("Using fallback campuses");
      setCampuses([
        { id: 1, name: "PTC Main Campus" },
        { id: 2, name: "PTC Branch Campus San Pedro" },
        { id: 3, name: "PTC Extension Campus ITRED" }
      ]);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
    fetchCampuses();
  }, [fetchOffices, fetchCampuses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.campus_id || !form.name) {
      return alert("Please fill required fields (Campus and Office Name)");
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/offices/${editingId}`, form, {
          headers: getAuthHeaders()
        });
        alert("Office updated successfully!");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/admin/offices", form, {
          headers: getAuthHeaders()
        });
        alert("Office added successfully!");
      }
      setForm({ campus_id: "", name: "", description: "", contact: "", office_hours: "" });
      fetchOffices();
    } catch (error) {
      console.error("Error saving office:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error saving office. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (office) => {
    setForm({
      campus_id: office.campus_id,
      name: office.name,
      description: office.description || "",
      contact: office.contact || "",
      office_hours: office.office_hours || "",
    });
    setEditingId(office.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this office?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/admin/offices/${id}`, {
        headers: getAuthHeaders()
      });
      alert("Office deleted successfully!");
      fetchOffices();
    } catch (error) {
      console.error("Error deleting office:", error);
      alert("Error deleting office. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ campus_id: "", name: "", description: "", contact: "", office_hours: "" });
    setEditingId(null);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "3px solid #388e3c", paddingBottom: "20px" }}>
          <h1 style={{ color: "#388e3c", margin: "0", fontSize: "2.5em", fontWeight: "bold", textShadow: "0 2px 8px #fffde7" }}>
            Manage Office Directory
          </h1>
        </div>
        <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ffc107", borderRadius: "10px", background: "#fffde7" }}>
          <h3 style={{ color: "#388e3c" }}>{editingId ? "Edit Office" : "Add New Office"}</h3>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Campus: * {campuses.length === 0 && "(Loading...)"}
            </label>
            <select 
              name="campus_id" 
              value={form.campus_id} 
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            >
              <option value="">Select Campus</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {campuses.length === 0 && (
              <p style={{ color: "red", fontSize: "0.9em" }}>
                No campuses found. Please add campuses to the database first.
              </p>
            )}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Office Name: *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="e.g., Registrar's Office"
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Description:
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              placeholder="Brief description of services"
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Contact Number:
            </label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              placeholder="e.g., (123) 456-7890"
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Office Hours:
            </label>
            <input
              type="text"
              name="office_hours"
              value={form.office_hours}
              placeholder="e.g., Mon-Fri 8:00 AM - 5:00 PM"
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div>
            <button 
              onClick={handleSave}
              disabled={loading || campuses.length === 0}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: campuses.length === 0 ? "#ccc" : "#388e3c", 
                color: "white", 
                border: "none", 
                borderRadius: "5px",
                marginRight: "10px",
                cursor: campuses.length === 0 ? "not-allowed" : "pointer",
                fontWeight: "bold"
              }}
            >
              {loading ? "Saving..." : (editingId ? "Update Office" : "Add Office")}
            </button>
            {editingId && (
              <button 
                onClick={handleCancelEdit}
                style={{ 
                  padding: "10px 20px", 
                  backgroundColor: "#ffc107", 
                  color: "#388e3c", 
                  border: "none", 
                  borderRadius: "5px",
                  fontWeight: "bold"
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
        <h3 style={{ color: "#388e3c" }}>Existing Offices</h3>
        {loading && <p>Loading...</p>}
        {offices.length === 0 && !loading ? (
          <p>No offices found.</p>
        ) : (
          <div>
            {offices.map((office) => (
              <div key={office.id} style={{ 
                border: "1px solid #ffc107", 
                borderRadius: "10px", 
                padding: "15px", 
                marginBottom: "10px",
                background: "#e8f5e9"
              }}>
                <h4 style={{ color: "#388e3c" }}>{office.name}</h4>
                <p><strong>Campus ID:</strong> {office.campus_id}</p>
                {office.description && <p><strong>Description:</strong> {office.description}</p>}
                {office.contact && <p><strong>Contact:</strong> {office.contact}</p>}
                {office.office_hours && <p><strong>Hours:</strong> {office.office_hours}</p>}
                <div style={{ marginTop: "10px" }}>
                  <button 
                    onClick={() => handleEdit(office)}
                    style={{ 
                      padding: "5px 15px", 
                      backgroundColor: "#388e3c", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "3px",
                      marginRight: "10px",
                      fontWeight: "bold"
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(office.id)}
                    style={{ 
                      padding: "5px 15px", 
                      backgroundColor: "#ffc107", 
                      color: "#388e3c", 
                      border: "none", 
                      borderRadius: "3px",
                      fontWeight: "bold"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminOffices;