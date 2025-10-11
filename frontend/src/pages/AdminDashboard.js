import React, { useState, useEffect } from "react";
import axios from "axios";


export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements", err);
    }
  };

  const addAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/announcements", {
        text: newAnnouncement,
      });
      setNewAnnouncement("");
      fetchAnnouncements();
    } catch (err) {
      console.error("Error adding announcement", err);
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/announcements/${editingId}`, {
        text: editText,
      });
      setEditingId(null);
      setEditText("");
      fetchAnnouncements();
    } catch (err) {
      console.error("Error editing announcement", err);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement", err);
    }
  };

  // Styles for background and card
  const backgroundStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "url('/ptclogo.png.png') center center / cover no-repeat, #e8f5e9",
    opacity: 0.18,
    zIndex: 1,
    pointerEvents: "none"
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
    padding: "40px 32px 32px 32px",
    maxWidth: "700px",
    margin: "60px auto 0 auto",
    position: "relative",
    zIndex: 2,
    textAlign: "center"
  };

  const logoStyle = {
    width: "90px",
    height: "90px",
    objectFit: "contain",
    position: "absolute",
    top: "-45px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "white",
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(44,62,80,0.12)",
    border: "3px solid #2e7d32"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <img src="/ptclogo.png.png" alt="PTC Logo" style={logoStyle} />
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>Admin Dashboard - Manage Announcements</h2>
        {/* Add new announcement */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter announcement..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            style={{ padding: "8px", width: "300px" }}
          />
          <button onClick={addAnnouncement} style={{ marginLeft: "10px" }}>
            Add
          </button>
        </div>
        {/* List announcements */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {announcements.map((a) => (
            <li key={a.id} style={{ marginBottom: "10px" }}>
              {editingId === a.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ padding: "5px", width: "250px" }}
                  />
                  <button onClick={saveEdit} style={{ marginLeft: "5px" }}>
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ marginLeft: "5px" }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{a.text}</span>
                  <button
                    onClick={() => startEdit(a.id, a.text)}
                    style={{ marginLeft: "10px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    style={{ marginLeft: "5px", color: "red" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
