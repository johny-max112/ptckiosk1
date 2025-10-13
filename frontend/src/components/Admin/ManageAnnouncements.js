
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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

function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    start_date: "",
    end_date: "",
    is_active: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/announcements", {
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

  const handleAddOrUpdate = async () => {
    const { title, content, start_date, end_date } = form;
    if (!title || !content || !start_date || !end_date) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);
      if (editingId) {
        // Update existing announcement
        await axios.put(
          `http://localhost:5000/api/admin/announcements/${editingId}`, 
          form,
          { headers: getAuthHeaders() }
        );
        alert("Announcement updated successfully!");
        setEditingId(null);
      } else {
        // Add new announcement
        await axios.post(
          "http://localhost:5000/api/admin/announcements", 
          form,
          { headers: getAuthHeaders() }
        );
        alert("Announcement added successfully!");
      }

      setForm({ title: "", content: "", start_date: "", end_date: "", is_active: 1 });
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
    setEditingId(announcement.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/admin/announcements/${id}`,
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
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "3px solid #388e3c", paddingBottom: "20px" }}>
          <h1 style={{ color: "#388e3c", margin: "0", fontSize: "2.5em", fontWeight: "bold", textShadow: "0 2px 8px #fffde7" }}>
           Manage Announcements
          </h1>
        </div>
        <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ffc107", borderRadius: "10px", background: "#fffde7" }}>
          <h3 style={{ color: "#388e3c" }}>{editingId ? "Edit Announcement" : "Add New Announcement"}</h3>
          <div style={{ marginBottom: "10px" }}>
            <input 
              name="title" 
              placeholder="Announcement Title" 
              value={form.title} 
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <textarea 
              name="content" 
              placeholder="Announcement Content" 
              value={form.content} 
              onChange={handleChange}
              rows={4}
              style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label>Start Date:</label>
              <input 
                type="date" 
                name="start_date" 
                value={form.start_date} 
                onChange={handleChange}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #388e3c" }}
              />
            </div>
            <div>
              <label>End Date:</label>
              <input 
                type="date" 
                name="end_date" 
                value={form.end_date} 
                onChange={handleChange}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #388e3c" }}
              />
            </div>
            <div>
              <label>Status:</label>
              <select 
                name="is_active" 
                value={form.is_active} 
                onChange={handleChange}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #388e3c" }}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <button 
              onClick={handleAddOrUpdate}
              disabled={loading}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#388e3c", 
                color: "white", 
                border: "none", 
                borderRadius: "5px",
                marginRight: "10px",
                fontWeight: "bold"
              }}
            >
              {loading ? "Saving..." : (editingId ? "Update Announcement" : "Add Announcement")}
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
        <h3 style={{ color: "#388e3c" }}>Existing Announcements</h3>
        {loading && <p>Loading...</p>}
        {announcements.length === 0 && !loading ? (
          <p>No announcements found.</p>
        ) : (
          <div>
            {announcements.map((a) => (
              <div key={a.id} style={{ border: "1px solid #ffc107", borderRadius: "10px", padding: "15px", marginBottom: "10px", background: a.is_active ? "#e8f5e9" : "#fff3cd" }}>
                <h4 style={{ color: "#388e3c" }}>{a.title}</h4>
                <p>{a.content}</p>
                <p>
                  <strong>Period:</strong> {a.start_date} → {a.end_date}
                </p>
                <p>
                  <strong>Status:</strong> 
                  <span style={{ 
                    color: a.is_active ? "#388e3c" : "#ffc107",
                    fontWeight: "bold"
                  }}>
                    {a.is_active ? " Active" : " Inactive"}
                  </span>
                </p>
                <div>
                  <button 
                    onClick={() => handleEdit(a)}
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
                    onClick={() => handleDelete(a.id)}
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

export default ManageAnnouncements;