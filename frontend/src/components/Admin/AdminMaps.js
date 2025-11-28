import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import api from "../../utils/api";
import "./AdminMaps.css";
function AdminMaps() {
  const navigate = useNavigate();
  const [maps, setMaps] = useState([]);
  const [form, setForm] = useState({
    campus_id: "",
    campus_name: "",
    embed_map_link: "",
    description_map: "",
    embed_streetview_link: "",
    description_streetview: "",
    address: ""
  });
  
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = () => {
    axios.get(api('/api/admin/maps'))
      .then(res => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const seen = new Set();
        const unique = [];
        rows.forEach(r => {
          if (!r || typeof r.id === 'undefined' || r.id === null) return;
          if (!seen.has(r.id)) {
            seen.add(r.id);
            unique.push(r);
          }
        });
        setMaps(unique);
      })
      .catch(err => console.error("Error fetching maps:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    const payload = {
      campus_id: form.campus_id,
      campus_name: form.campus_name,
      embed_map_link: form.embed_map_link,
      description_map: form.description_map,
      embed_streetview_link: form.embed_streetview_link,
      description_streetview: form.description_streetview,
      address: form.address,
    };

    axios.post(api('/api/admin/maps'), payload)
      .then(() => {
        alert("Map added successfully");
        resetForm();
        fetchMaps();
      })
      .catch(err => {
        console.error("Error saving map:", err);
        alert("Upload failed. Check backend logs for details.");
      });
  };

  const handleEdit = (map) => {
    setForm({
      campus_id: map.campus_id,
      campus_name: map.campus_name,
      embed_map_link: map.embed_map_link || "",
      description_map: map.description_map || "",
      embed_streetview_link: map.embed_streetview_link || "",
      description_streetview: map.description_streetview || "",
      address: map.address,
    });
    setEditingId(map.id);
    
    // pag nag edit ng forms sa from the bottom and click mag scroll auto sa top ng inputs
    setTimeout(() => {
      const el = document.querySelector('.admin-form-maps');
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleUpdate = () => {
    const payload = {
      campus_id: form.campus_id,
      campus_name: form.campus_name,
      embed_map_link: form.embed_map_link,
      description_map: form.description_map,
      embed_streetview_link: form.embed_streetview_link,
      description_streetview: form.description_streetview,
      address: form.address,
    };

    axios.put(api(`/api/admin/maps/${editingId}`), payload)
      .then(() => {
        alert("Map updated successfully");
        resetForm();
        fetchMaps();
      })
      .catch(err => console.error("Error updating map:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this map?")) {
      axios.delete(api(`/api/admin/maps/${id}`))
        .then(() => {
          alert("Map deleted");
          fetchMaps();
        })
        .catch(err => console.error("Error deleting map:", err));
    }
  };

  const resetForm = () => {
    setForm({
      campus_id: "",
      campus_name: "",
      embed_map_link: "",
      description_map: "",
      embed_streetview_link: "",
      description_streetview: "",
      address: ""
    });
    
    setEditingId(null);
  };

  return (
    <div className="admin-page-maps">
      <div className="admin-bg-maps" style={{ backgroundImage: "url('/pateros.png')" }}></div>
      <div className="admin-card-maps">
        <div className="admin-back-container">
          <button onClick={() => navigate('/admin/dashboard')} className="btn-map admin-back-btn">← Back to Dashboard</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 style={{ color: "#388e3c", margin: "0", fontSize: "2.2em", fontWeight: "bold", textShadow: "0 2px 8px #fffde7" }}>
            Manage Campus Maps
          </h1>
        </div>

        {/* Form Section */}
        <div className="admin-form-maps">
          <input className="input-map" type="text" name="campus_id" value={form.campus_id} placeholder="Campus ID" onChange={handleChange} /><br />
          <input className="input-map" type="text" name="campus_name" value={form.campus_name} placeholder="Campus Name" onChange={handleChange} /><br />
          <label style={{ fontWeight: 600 }}>Map Embed Link (iframe src)</label>
          <input className="input-map" type="text" name="embed_map_link" value={form.embed_map_link} placeholder="https://www.google.com/maps/embed?pb=..." onChange={handleChange} /><br />
          <textarea className="input-map" name="description_map" value={form.description_map} placeholder="Short description for map view" onChange={handleChange} rows={2} /><br />

          <label style={{ fontWeight: 600 }}>Street View Embed Link (iframe src)</label>
          <input className="input-map" type="text" name="embed_streetview_link" value={form.embed_streetview_link} placeholder="https://www.google.com/maps/embed?pb=... (streetview)" onChange={handleChange} /><br />
          <textarea className="input-map" name="description_streetview" value={form.description_streetview} placeholder="Short description for street view" onChange={handleChange} rows={2} /><br />

          <input className="input-map" type="text" name="address" value={form.address} placeholder="Campus Address" onChange={handleChange} /><br />
          {editingId ? (
            <>
              <button onClick={handleUpdate} className="btn-map primary">Update Map</button>
              <button onClick={resetForm} className="btn-map warn" style={{ marginLeft: 10 }}>Cancel</button>
            </>
          ) : (
            <button onClick={handleSave} className="btn-map primary">Add Map</button>
          )}
        </div>

        {/* Display Section */}
        <h3 style={{ color: "#388e3c" }}>Existing Maps</h3>
        <ul style={{ textAlign: "left" }}>
          {maps.map((map) => (
            <li key={map.id} className="map-item">
              <strong style={{ color: "#388e3c" }}>{map.campus_name || `Campus ${map.campus_id}`}</strong><br />
                <span style={{ color: "#6c757d", fontSize: "0.95em" }}>{map.address}</span><br />
              <p style={{ margin: "6px 0" }}>{map.description_map || map.description_streetview}</p>
                {map.embed_map_link && (
                <div style={{ marginTop: 6 }}>
                  <small style={{ color: '#2d7a2d' }}>Map embed available</small>
                </div>
              )}
                {map.embed_streetview_link && (
                <div style={{ marginTop: 6 }}>
                  <small style={{ color: '#2d7a2d' }}>Street View embed available</small>
                </div>
              )}
                <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleEdit(map)} className="btn-map primary" style={{ marginRight: 10 }}>Edit</button>
                <button onClick={() => handleDelete(map.id)} className="btn-map" style={{ backgroundColor: '#e74c3c', color: '#fff' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default AdminMaps;
