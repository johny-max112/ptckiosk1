import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import api from "../../utils/api";
import "./AdminOffices.css";

function AdminOffices() {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [form, setForm] = useState({
    campus_id: "",
    name: "",
    description: "",
    contact: "",
    office_hours: ""
  });
  // Styles moved to AdminOffices.css; background image applied inline in JSX
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchOffices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(api("/api/admin/offices"), {
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
      const res = await axios.get(api("/api/admin/campuses"), {
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
        await axios.put(api(`/api/admin/offices/${editingId}`), form, {
          headers: getAuthHeaders()
        });
        alert("Office updated successfully!");
        setEditingId(null);
      } else {
        await axios.post(api("/api/admin/offices"), form, {
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
      await axios.delete(api(`/api/admin/offices/${id}`), {
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
    <div className="admin-page-offices">
      <div className="admin-bg-offices" style={{ backgroundImage: "url('/pateros.png')" }}></div>
      <div className="admin-card-offices">
        <div className="admin-back-container">
          <button onClick={() => navigate('/admin/dashboard')} className="btn-offices admin-back-btn">← Back to Dashboard</button>
        </div>
        <div className="header" style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1>Manage Office Directory</h1>
        </div>

        <div className="admin-form-offices">
          <h3>{editingId ? "Edit Office" : "Add New Office"}</h3>
          <div>
            <label className="admin-label">Campus: * {campuses.length === 0 && "(Loading...)"}</label>
            <select name="campus_id" value={form.campus_id} onChange={handleChange} className="admin-input">
              <option value="">Select Campus</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {campuses.length === 0 && <p style={{ color: 'red', fontSize: '0.9em' }}>No campuses found. Please add campuses to the database first.</p>}
          </div>
          <div>
            <label className="admin-label">Office Name: *</label>
            <input type="text" name="name" value={form.name} placeholder="e.g., Registrar's Office" onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Description:</label>
            <input type="text" name="description" value={form.description} placeholder="Brief description of services" onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Room:</label>
            <input type="text" name="contact" value={form.contact} placeholder="e.g., (123) 456-7890" onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Office Hours:</label>
            <input type="text" name="office_hours" value={form.office_hours} placeholder="e.g., Mon-Fri 8:00 AM - 5:00 PM" onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <button onClick={handleSave} disabled={loading || campuses.length === 0} className={`btn-offices ${campuses.length === 0 ? '' : 'btn-offices-primary'}`} style={campuses.length === 0 ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}>
              {loading ? "Saving..." : (editingId ? "Update Office" : "Add Office")}
            </button>
            {editingId && (<button onClick={handleCancelEdit} className="btn-offices btn-offices-warning">Cancel Edit</button>)}
          </div>
        </div>

        <h3 style={{ color: "#388e3c" }}>Existing Offices</h3>
        {loading && <p>Loading...</p>}
        {offices.length === 0 && !loading ? (
          <p>No offices found.</p>
        ) : (
          <div>
            {offices.map((office) => (
              <div key={office.id} className="office-item">
                <h4 style={{ color: "#388e3c" }}>{office.name}</h4>
                <p><strong>Campus ID:</strong> {office.campus_id}</p>
                {office.description && <p><strong>Description:</strong> {office.description}</p>}
                {office.contact && <p><strong>Contact:</strong> {office.contact}</p>}
                {office.office_hours && <p><strong>Hours:</strong> {office.office_hours}</p>}
                <div className="office-controls">
                  <button onClick={() => handleEdit(office)} className="btn-offices btn-offices-primary" style={{ padding: '5px 15px', marginRight: 10 }}>Edit</button>
                  <button onClick={() => handleDelete(office.id)} className="btn-offices btn-offices-warning" style={{ padding: '5px 15px' }}>Delete</button>
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