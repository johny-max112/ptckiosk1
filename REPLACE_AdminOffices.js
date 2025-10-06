// COPY THIS TO: frontend/src/components/Admin/AdminOffices.js
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
    office_hours: "",
  });
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
        window.location.href = "/admin";
      } else {
        alert("Error fetching offices. Please try again.");
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
      setCampuses(res.data);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      // Set default campuses if API fails
      setCampuses([
        { id: 1, name: "Main Campus" },
        { id: 2, name: "Branch Campus" }
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
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error deleting office. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ campus_id: "", name: "", description: "", contact: "", office_hours: "" });
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>📇 Manage Office Directory</h2>

      <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3>{editingId ? "Edit Office" : "Add New Office"}</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Campus: *
          </label>
          <select 
            name="campus_id" 
            value={form.campus_id} 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="">Select Campus</option>
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <div>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              marginRight: "10px"
            }}
          >
            {loading ? "Saving..." : (editingId ? "Update Office" : "Add Office")}
          </button>
          
          {editingId && (
            <button 
              onClick={handleCancelEdit}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#6c757d", 
                color: "white", 
                border: "none", 
                borderRadius: "5px"
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <h3>Existing Offices</h3>
      {loading && <p>Loading...</p>}
      
      {offices.length === 0 && !loading ? (
        <p>No offices found.</p>
      ) : (
        <div>
          {offices.map((office) => (
            <div key={office.id} style={{ 
              border: "1px solid #ddd", 
              borderRadius: "5px", 
              padding: "15px", 
              marginBottom: "10px",
              backgroundColor: "#f8f9fa"
            }}>
              <h4>{office.name}</h4>
              <p><strong>Campus ID:</strong> {office.campus_id}</p>
              {office.description && <p><strong>Description:</strong> {office.description}</p>}
              {office.contact && <p><strong>Contact:</strong> {office.contact}</p>}
              {office.office_hours && <p><strong>Hours:</strong> {office.office_hours}</p>}
              <div style={{ marginTop: "10px" }}>
                <button 
                  onClick={() => handleEdit(office)}
                  style={{ 
                    padding: "5px 15px", 
                    backgroundColor: "#28a745", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "3px",
                    marginRight: "10px"
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(office.id)}
                  style={{ 
                    padding: "5px 15px", 
                    backgroundColor: "#dc3545", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "3px"
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
  );
}

export default AdminOffices;