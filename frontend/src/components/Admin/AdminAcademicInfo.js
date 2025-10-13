
import React, { useEffect, useState, useCallback } from "react";
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

function AdminAcademicInfo() {
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
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "3px solid #388e3c", paddingBottom: "20px" }}>
          <h1 style={{ color: "#388e3c", margin: "0", fontSize: "2.5em", fontWeight: "bold", textShadow: "0 2px 8px #fffde7" }}>
             Manage Academic Info
          </h1>
        </div>
        <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ffc107", borderRadius: "10px", background: "#fffde7" }}>
          <h3 style={{ color: "#388e3c" }}>{editingId ? "Edit Academic Info" : "Add New Academic Info"}</h3>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              name="title"
              value={form.title}
              placeholder="Title (e.g., Computer Science Program)"
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <textarea
              name="content"
              value={form.content}
              placeholder="Content/Description"
              onChange={handleChange}
              rows={6}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #388e3c" }}
            />
          </div>
          <div>
            <button 
              onClick={handleSave}
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
              {loading ? "Saving..." : (editingId ? "Update" : "Add Academic Info")}
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
        <h3 style={{ color: "#388e3c" }}>Existing Academic Information</h3>
        {loading && <p>Loading...</p>}
        {academicList.length === 0 && !loading ? (
          <p>No academic information found.</p>
        ) : (
          <div>
            {academicList.map((item) => (
              <div key={item.id} style={{ 
                border: "1px solid #ffc107", 
                borderRadius: "10px", 
                padding: "15px", 
                marginBottom: "10px",
                background: "#e8f5e9"
              }}>
                <h4 style={{ color: "#388e3c" }}>{item.title}</h4>
                <p>{item.content}</p>
                <div>
                  <button 
                    onClick={() => handleEdit(item)}
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
                    onClick={() => handleDelete(item.id)}
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

export default AdminAcademicInfo;