import React, { useEffect, useState } from "react";
import axios from "axios";

const backgroundStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/pateros.png')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.70) contrast(1.1)",
    zIndex: 1,
    pointerEvents: "none"
  };

const cardStyle = {
  background: "linear-gradient(135deg, #fffde7 0%, #ffffff 100%)",
  borderRadius: "18px",
  boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
  padding: "40px 32px 32px 32px",
  maxWidth: "700px",
  margin: "60px auto 0 auto",
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  border: "3px solid #ffc107"
};

function AdminMaps() {
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
    axios.get("http://localhost:5000/api/admin/maps")
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

    axios.post("http://localhost:5000/api/admin/maps", formData)
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
  };

  const handleUpdate = () => {
    const payload = {
      campus_id: form.campus_id,
      campus_name: form.campus_name,
      description: form.description,
      address: form.address,
      image_path: "" // optional: keep existing image unless changed
    };

    axios.put(`http://localhost:5000/api/admin/maps/${editingId}`, payload)
      .then(() => {
        alert("Map updated successfully");
        resetForm();
        fetchMaps();
      })
      .catch(err => console.error("Error updating map:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this map?")) {
      axios.delete(`http://localhost:5000/api/admin/maps/${id}`)
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
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "3px solid #388e3c", paddingBottom: "20px" }}>
          <h1 style={{ color: "#388e3c", margin: "0", fontSize: "2.2em", fontWeight: "bold", textShadow: "0 2px 8px #fffde7" }}>
            Manage Campus Maps
          </h1>
        </div>

        {/* Form Section */}
        <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ffc107", borderRadius: "10px", background: "#fffde7" }}>
          <input type="text" name="campus_id" value={form.campus_id} placeholder="Campus ID" onChange={handleChange} style={inputStyle} /><br />
          <input type="text" name="campus_name" value={form.campus_name} placeholder="Campus Name" onChange={handleChange} style={inputStyle} /><br />
          <textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} rows={3} style={inputStyle} /><br />
          <input type="text" name="address" value={form.address} placeholder="Campus Address" onChange={handleChange} style={inputStyle} /><br />
          <input type="file" name="image" accept="image/*" onChange={handleChange} style={inputStyle} /><br />
          {preview && (
            <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: "6px", marginBottom: "10px" }} />
          )}
          {editingId ? (
            <>
              <button onClick={handleUpdate} style={buttonStyle}>Update Map</button>
              <button onClick={resetForm} style={{ ...buttonStyle, backgroundColor: "#6c757d", marginLeft: "10px" }}>Cancel</button>
            </>
          ) : (
            <button onClick={handleSave} style={buttonStyle}>Add Map</button>
          )}
        </div>

        {/* Display Section */}
        <h3 style={{ color: "#388e3c" }}>Existing Maps</h3>
        <ul style={{ textAlign: "left" }}>
          {maps.map((map) => (
            <li key={map.id} style={mapItemStyle}>
              <strong style={{ color: "#388e3c" }}>{map.campus_name || `Campus ${map.campus_id}`}</strong><br />
              <span style={{ color: "#6c757d", fontSize: "0.95em" }}>{map.address}</span><br />
              <p style={{ margin: "6px 0" }}>{map.description}</p>
              {map.image_path && (
                <img
                  src={`http://localhost:5000${map.image_path}`}
                  alt={map.description}
                  style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: "6px", marginTop: "6px" }}
                />
              )}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleEdit(map)} style={editButtonStyle}>Edit</button>
                <button onClick={() => handleDelete(map.id)} style={deleteButtonStyle}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Reusable styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #388e3c"
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#388e3c",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold"
};

const editButtonStyle = {
  marginRight: "10px",
  padding: "6px 12px",
  backgroundColor: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: "4px",
  fontWeight: "bold"
};

const deleteButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontWeight: "bold"
};

const mapItemStyle = {
  background: "#e8f5e9",
  border: "1px solid #ffc107",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "8px"
};


export default AdminMaps;
