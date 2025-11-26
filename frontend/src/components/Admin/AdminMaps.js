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
    description: "",
    address: "",
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = () => {
    axios.get(api('/api/admin/maps'))
      .then(res => setMaps(res.data))
      .catch(err => console.error("Error fetching maps:", err));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = () => {
    if (!form.image) {
      alert("Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("campus_id", form.campus_id);
    formData.append("campus_name", form.campus_name);
    formData.append("description", form.description);
    formData.append("address", form.address);
    formData.append("image", form.image);

    axios.post(api('/api/admin/maps'), formData)
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
      description: map.description,
      address: map.address,
      image: null
    });
    setEditingId(map.id);
    setPreview(null);
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
      description: form.description,
      address: form.address,
      image_path: "" // optional: keep existing image unless changed
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
      description: "",
      address: "",
      image: null
    });
    setPreview(null);
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
          <textarea className="input-map" name="description" value={form.description} placeholder="Description" onChange={handleChange} rows={3} /><br />
          <input className="input-map" type="text" name="address" value={form.address} placeholder="Campus Address" onChange={handleChange} /><br />
          <input className="input-map" type="file" name="image" accept="image/*" onChange={handleChange} /><br />
          {preview && (
            <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: "6px", marginBottom: "10px" }} />
          )}
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
              <p style={{ margin: "6px 0" }}>{map.description}</p>
                {map.image_path && (
                <img
                  src={api(map.image_path)}
                  alt={map.description}
                  style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: "6px", marginTop: "6px" }}
                />
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
