
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import api from "../../utils/api";
import "./ManageAnnouncements.css";

function ManageAnnouncements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    start_date: "",
    end_date: "",
    is_active: 1,
  });
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(api("/api/admin/announcements"), {
        headers: getAuthHeaders()
      });
      setAnnouncements(res.data);
    } catch (error) {
  console.error("Axios error details:", error.toJSON?.() || error);
  if (error.response?.status === 401) {
    alert("Session expired. Please login again.");
    window.location.href = "/admin";
  } else {
    alert(`Error fetching announcements: ${error.message}`);
  }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
  };

  const handleAddOrUpdate = async () => {
    const { title, content, start_date, end_date } = form;
    if (!title || !content || !start_date || !end_date) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);
      if (editingId) {
        // Update existing announcement
        // if file is present, send multipart/form-data
        if (file) {
          const fd = new FormData();
          Object.entries(form).forEach(([k, v]) => fd.append(k, v));
          fd.append('image', file);
          await axios.put(api(`/api/admin/announcements/${editingId}`), fd, {
            headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
          });
        } else {
          await axios.put(api(`/api/admin/announcements/${editingId}`), form, { headers: getAuthHeaders() });
        }
        alert("Announcement updated successfully!");
        setEditingId(null);
      } else {
        // Add new announcement
        if (file) {
          const fd = new FormData();
          Object.entries(form).forEach(([k, v]) => fd.append(k, v));
          fd.append('image', file);
          await axios.post(api("/api/admin/announcements"), fd, {
            headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
          });
        } else {
          await axios.post(api("/api/admin/announcements"), form, { headers: getAuthHeaders() });
        }
        alert("Announcement added successfully!");
      }

      setForm({ title: "", content: "", start_date: "", end_date: "", is_active: 1 });
      setFile(null);
      setExistingImage(null);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error saving announcement. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      content: announcement.content,
      start_date: announcement.start_date?.split('T')[0] || announcement.start_date,
      end_date: announcement.end_date?.split('T')[0] || announcement.end_date,
      is_active: announcement.is_active,
    });
    setExistingImage(announcement.image_path || null);
    setEditingId(announcement.id);
    // pag nag edit ng forms sa from the bottom and click mag scroll auto sa top ng inputs
    setTimeout(() => {
      const el = document.querySelector('.admin-form');
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        api(`/api/admin/announcements/${id}`),
        { headers: getAuthHeaders() }
      );
      alert("Announcement deleted successfully!");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error deleting announcement. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ title: "", content: "", start_date: "", end_date: "", is_active: 1 });
    setEditingId(null);
  };

  return (
    <div className="admin-manage-announcements">
      <div className="admin-bg" style={{ backgroundImage: "url('/pateros.png')" }} />
      <div className="admin-card">
        <div className="admin-back-container">
          <button onClick={() => navigate('/admin/dashboard')} className="btn admin-back-btn">← Back to Dashboard</button>
        </div>
        <div className="header" style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1>Manage Announcements</h1>
        </div>

        <div className="admin-form">
          <h3>{editingId ? "Edit Announcement" : "Add New Announcement"}</h3>
          <div className="form-row">
            <input
              name="title"
              placeholder="Announcement Title"
              value={form.title}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-row">
            <textarea
              name="content"
              placeholder="Announcement Content"
              value={form.content}
              onChange={handleChange}
              rows={4}
              className="input"
            />
          </div>
          <div className="flex-row">
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="date-input"
              />
            </div>
            <div>
              <label>End Date:</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="date-input"
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                name="is_active"
                value={form.is_active}
                onChange={handleChange}
                className="select"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label style={{ display: 'block', marginBottom: 8 }}>Optional Image (will be shown in kiosk modal)</label>
            {existingImage && !file && (
              <div style={{ marginBottom: 8 }}>
                <img src={api(existingImage)} alt="existing" style={{ maxWidth: 240, maxHeight: 140, display: 'block', marginBottom: 6 }} />
                <small>Uploading a new image will replace the existing one.</small>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-row">
            <button onClick={handleAddOrUpdate} disabled={loading} className="btn btn-primary">
              {loading ? "Saving..." : (editingId ? "Update Announcement" : "Add Announcement")}
            </button>
            {editingId && (
              <button onClick={handleCancelEdit} className="btn btn-warning">
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <h3 style={{ color: "#388e3c" }}>Existing Announcements</h3>
        {loading && <p>Loading...</p>}
        {announcements.length === 0 && !loading ? (
          <p>No announcements found.</p>
        ) : (
          <div className="announcements-list">
            {announcements.map((a) => (
              <div key={a.id} className={`announcement ${a.is_active ? '' : 'inactive'}`}>
                <h4>{a.title}</h4>
                <p>{a.content}</p>
                <p>
                  <strong>Period:</strong> {a.start_date} → {a.end_date}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status ${a.is_active ? 'active' : 'inactive'}`}>
                    {a.is_active ? " Active" : " Inactive"}
                  </span>
                </p>
                <div className="controls">
                  <button onClick={() => handleEdit(a)} className="small-btn small-btn-primary">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="small-btn small-btn-warning">
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

export default ManageAnnouncements;