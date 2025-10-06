// COPY THIS TO: frontend/src/components/Admin/AdminMaps.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function AdminMaps() {
  const [maps, setMaps] = useState([]);
  const [form, setForm] = useState({ campus_id: "1", image_path: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchMaps = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/maps", {
        headers: getAuthHeaders()
      });
      setMaps(res.data);
    } catch (error) {
      console.error("Error fetching maps:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error fetching maps. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.image_path || !form.description) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/maps/${editingId}`, form, {
          headers: getAuthHeaders()
        });
        alert("Map updated successfully!");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/admin/maps", form, {
          headers: getAuthHeaders()
        });
        alert("Map added successfully!");
      }
      setForm({ campus_id: "1", image_path: "", description: "" });
      fetchMaps();
    } catch (error) {
      console.error("Error saving map:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error saving map. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (map) => {
    setForm({
      campus_id: map.campus_id,
      image_path: map.image_path,
      description: map.description
    });
    setEditingId(map.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this map?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/admin/maps/${id}`, {
        headers: getAuthHeaders()
      });
      alert("Map deleted successfully!");
      fetchMaps();
    } catch (error) {
      console.error("Error deleting map:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        alert("Error deleting map. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ campus_id: "1", image_path: "", description: "" });
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🗺️ Manage Campus Maps</h2>

      <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3>{editingId ? "Edit Map" : "Add New Map"}</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Campus ID:
          </label>
          <select
            name="campus_id"
            value={form.campus_id}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="1">Main Campus</option>
            <option value="2">Branch Campus</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Image URL:
          </label>
          <input
            type="text"
            name="image_path"
            value={form.image_path}
            placeholder="https://example.com/map-image.jpg"
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Description:
          </label>
          <textarea
            name="description"
            value={form.description}
            placeholder="Map description..."
            onChange={handleChange}
            rows={4}
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
            {loading ? "Saving..." : (editingId ? "Update Map" : "Add Map")}
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

      <h3>Existing Maps</h3>
      {loading && <p>Loading...</p>}
      
      {maps.length === 0 && !loading ? (
        <p>No maps found.</p>
      ) : (
        <div>
          {maps.map((map) => (
            <div key={map.id} style={{ 
              border: "1px solid #ddd", 
              borderRadius: "5px", 
              padding: "15px", 
              marginBottom: "10px",
              backgroundColor: "#f8f9fa"
            }}>
              <h4>Campus {map.campus_id} - {map.description}</h4>
              <p><strong>Image URL:</strong> {map.image_path}</p>
              {map.image_path && (
                <img 
                  src={map.image_path} 
                  alt="Campus map" 
                  style={{ 
                    width: "200px", 
                    height: "auto", 
                    marginTop: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "3px"
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div style={{ marginTop: "10px" }}>
                <button 
                  onClick={() => handleEdit(map)}
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
                  onClick={() => handleDelete(map.id)}
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

export default AdminMaps;