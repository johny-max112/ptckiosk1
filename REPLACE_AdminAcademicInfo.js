// COPY THIS TO: frontend/src/components/Admin/AdminAcademicInfo.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>📝 Manage Academic Info</h2>
      
      <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3>{editingId ? "Edit Academic Info" : "Add New Academic Info"}</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="Title (e.g., Computer Science Program)"
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="content"
            value={form.content}
            placeholder="Content/Description"
            onChange={handleChange}
            rows={6}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
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
            {loading ? "Saving..." : (editingId ? "Update" : "Add Academic Info")}
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

      <h3>Existing Academic Information</h3>
      {loading && <p>Loading...</p>}
      
      {academicList.length === 0 && !loading ? (
        <p>No academic information found.</p>
      ) : (
        <div>
          {academicList.map((item) => (
            <div key={item.id} style={{ 
              border: "1px solid #ddd", 
              borderRadius: "5px", 
              padding: "15px", 
              marginBottom: "10px",
              backgroundColor: "#f8f9fa"
            }}>
              <h4>{item.title}</h4>
              <p>{item.content}</p>
              <div>
                <button 
                  onClick={() => handleEdit(item)}
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
                  onClick={() => handleDelete(item.id)}
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

export default AdminAcademicInfo;