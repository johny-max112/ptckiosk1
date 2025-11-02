
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./AdminAcademicInfo.css";

function AdminAcademicInfo() {
  const navigate = useNavigate();
  const [academicList, setAcademicList] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAcademicInfo = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/academic", {
        headers: getAuthHeaders()
      });
      setAcademicList(res.data);
    } catch (error) {
      console.error("Error fetching academic info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error fetching academic info. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademicInfo();
  }, [fetchAcademicInfo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/academic/${editingId}`, form, {
          headers: getAuthHeaders()
        });
        alert("Academic info updated successfully!");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/admin/academic", form, {
          headers: getAuthHeaders()
        });
        alert("Academic info added successfully!");
      }
      setForm({ title: "", content: "" });
      fetchAcademicInfo();
    } catch (error) {
      console.error("Error saving academic info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error saving academic info. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, content: item.content });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this academic info?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/admin/academic/${id}`, {
        headers: getAuthHeaders()
      });
      alert("Academic info deleted successfully!");
      fetchAcademicInfo();
    } catch (error) {
      console.error("Error deleting academic info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error deleting academic info. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ title: "", content: "" });
    setEditingId(null);
  };

  return (
    <div className="admin-page-academicinfo">
      <div className="admin-bg-academicinfo" style={{ backgroundImage: "url('/pateros.png')" }}></div>
      <div className="admin-card-academicinfo">
        <div className="admin-back-container">
          <button onClick={() => navigate('/admin/dashboard')} className="btn-academicinfo admin-back-btn">← Back to Dashboard</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 style={{ color: "#388e3c", margin: "0", fontSize: "2.5em", fontWeight: "bold", textShadow: "0 2px 8px #fffde7" }}>
             Manage Academic Info
          </h1>
        </div>
        <div className="admin-form-academicinfo">
          <h3>{editingId ? "Edit Academic Info" : "Add New Academic Info"}</h3>
          <div>
            <input className="input-academicinfo" type="text" name="title" value={form.title} placeholder="Title (e.g., Computer Science Program)" onChange={handleChange} />
          </div>
          <div>
            <textarea className="input-academicinfo" name="content" value={form.content} placeholder="Content/Description" onChange={handleChange} rows={6} />
          </div>
          <div>
            <button onClick={handleSave} disabled={loading} className="btn-academicinfo primary">{loading ? "Saving..." : (editingId ? "Update" : "Add Academic Info")}</button>
            {editingId && (<button onClick={handleCancelEdit} className="btn-academicinfo warn">Cancel Edit</button>)}
          </div>
        </div>
        <h3 style={{ color: "#388e3c" }}>Existing Academic Information</h3>
        {loading && <p>Loading...</p>}
        {academicList.length === 0 && !loading ? (
          <p>No academic information found.</p>
        ) : (
          <div>
            {academicList.map((item) => (
              <div key={item.id} className="list-item">
                <h4 style={{ color: "#388e3c" }}>{item.title}</h4>
                <p>{item.content}</p>
                <div>
                  <button onClick={() => handleEdit(item)} className="btn-academicinfo primary" style={{ padding: '5px 15px', marginRight: 10 }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="btn-academicinfo warn" style={{ padding: '5px 15px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAcademicInfo;