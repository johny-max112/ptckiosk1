import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./AdminAbout.css";

function AdminAbout() {
  const navigate = useNavigate();
  const [about, setAbout] = useState({ mission: "", vision: "", history: "" });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // file states for admin uploads
  const [innerImageFile, setInnerImageFile] = useState(null);
  const [innerImagePreview, setInnerImagePreview] = useState(null);
  const [presidentImageFile, setPresidentImageFile] = useState(null);
  const [presidentImagePreview, setPresidentImagePreview] = useState(null);
  const [missionImageFile, setMissionImageFile] = useState(null);
  const [missionImagePreview, setMissionImagePreview] = useState(null);
  const [visionImageFile, setVisionImageFile] = useState(null);
  const [visionImagePreview, setVisionImagePreview] = useState(null);

  const [presidentName, setPresidentName] = useState("");
  const [presidentTitle, setPresidentTitle] = useState("");

  const [coreValues, setCoreValues] = useState("");
  const [hymnLeft, setHymnLeft] = useState("");
  const [hymnRight, setHymnRight] = useState("");

  // former admins as array of objects {name, position, year, file, preview, image}
  const [formerAdmins, setFormerAdmins] = useState([]);

  // Ensure the about form is visible when the page loads
  useEffect(() => {
    setTimeout(() => {
      const el = document.querySelector('.admin-card-about');
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const apiBase = process.env.REACT_APP_API_URL || '';
      const res = await axios.get(`${apiBase}/api/admin/about`, { headers: getAuthHeaders() });
      if (res.data) {
        const d = res.data;
        setAbout({ mission: d.mission || "", vision: d.vision || "", history: d.history || "" });
        setPresidentName(d.president_name || "");
        setPresidentTitle(d.president_title || "");
        setCoreValues(d.core_values || "");
        setHymnLeft(d.hymn_left || "");
        setHymnRight(d.hymn_right || "");
        setInnerImagePreview(d.inner_image || null);
        setPresidentImagePreview(d.president_image || null);
        setMissionImagePreview(d.mission_image || null);
        setVisionImagePreview(d.vision_image || null);
        setFormerAdmins((d.former_admins && Array.isArray(d.former_admins)) ? d.former_admins.map(f => ({ ...f })) : []);
      }
    } catch (error) {
      console.error("Error fetching about info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        setSaveStatus("Error loading data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleChange = (e) => {
    setAbout({ ...about, [e.target.name]: e.target.value });
    setSaveStatus(""); // Clear status when user types
  };

  const handleFile = (e, setterFile, setterPreview) => {
    const f = e.target.files && e.target.files[0];
    setterFile(f || null);
    setterPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSave = async () => {
    if (!about.mission && !about.vision && !about.history && !coreValues && !hymnLeft && !hymnRight) {
      setSaveStatus("Please fill at least one field");
      return;
    }

    try {
      setLoading(true);
      setSaveStatus("Saving...");

      const apiBase = process.env.REACT_APP_API_URL || '';
      const fd = new FormData();
      fd.append('mission', about.mission || '');
      fd.append('vision', about.vision || '');
      fd.append('history', about.history || '');
      fd.append('president_name', presidentName);
      fd.append('president_title', presidentTitle);
      fd.append('core_values', coreValues);
      fd.append('hymn_left', hymnLeft);
      fd.append('hymn_right', hymnRight);

      // former admins metadata
      fd.append('former_admins', JSON.stringify(formerAdmins.map(f => ({ name: f.name, position: f.position, year: f.year, image: f.image || null }))));

      if (innerImageFile) fd.append('inner_image', innerImageFile);
      if (presidentImageFile) fd.append('president_image', presidentImageFile);
      if (missionImageFile) fd.append('mission_image', missionImageFile);
      if (visionImageFile) fd.append('vision_image', visionImageFile);

      // append former admin files in same order
      formerAdmins.forEach((f) => {
        if (f.file) fd.append('former_admin_images', f.file);
      });

      const res = await axios.post(`${apiBase}/api/admin/about`, fd, { headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } });
      // If server returned the saved row, update state immediately
      if (res && res.data) {
        const d = res.data;
        setAbout({ mission: d.mission || "", vision: d.vision || "", history: d.history || "" });
        setPresidentName(d.president_name || "");
        setPresidentTitle(d.president_title || "");
        setCoreValues(d.core_values || "");
        setHymnLeft(d.hymn_left || "");
        setHymnRight(d.hymn_right || "");
        setInnerImagePreview(d.inner_image || null);
        setPresidentImagePreview(d.president_image || null);
        setMissionImagePreview(d.mission_image || null);
        setVisionImagePreview(d.vision_image || null);
        setFormerAdmins((d.former_admins && Array.isArray(d.former_admins)) ? d.former_admins.map(f => ({ ...f })) : []);
      }

      setSaveStatus("✅ Saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error saving about info:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      } else {
        setSaveStatus("❌ Error saving. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getCharCount = (text) => (text ? text.length : 0);
  const getWordCount = (text) =>
    text ? text.trim().split(/\s+/).filter((word) => word.length > 0).length : 0;

  const addFormerAdmin = () => setFormerAdmins([...formerAdmins, { name: '', position: '', year: '', file: null, preview: null, image: null }]);
  const removeFormerAdmin = (idx) => setFormerAdmins(formerAdmins.filter((_, i) => i !== idx));
  const updateFormerAdmin = (idx, changes) => setFormerAdmins(formerAdmins.map((f, i) => i===idx ? { ...f, ...changes } : f));

  return (
    <div className="admin-page-about">
      <div
        className="admin-bg-about"
        style={{ backgroundImage: "url('/pateros.png')" }}
      />

      <div className="admin-card-about">
        <div className="admin-back-container">
          <button onClick={() => navigate('/admin/dashboard')} className="btn-about admin-back-btn">← Back to Dashboard</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 style={{ margin: 0 }}>Manage About PTC</h1>
          <p style={{ color: "#2e7d32", margin: "6px 0 0 0", fontSize: "1.1em" }}>
            Update institutional information displayed to kiosk users
          </p>
        </div>

        {loading && (
          <div className="header" style={{ padding: "20px", color: "#007bff", fontSize: "1.1em" }}>
            Loading...
          </div>
        )}

        {saveStatus && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: saveStatus.includes("✅") ? "#d4edda" : saveStatus.includes("❌") ? "#f8d7da" : "#fff3cd",
              border: `1px solid ${saveStatus.includes("✅") ? "#c3e6cb" : saveStatus.includes("❌") ? "#f5c6cb" : "#ffeaa7"}`,
              color: saveStatus.includes("✅") ? "#155724" : saveStatus.includes("❌") ? "#721c24" : "#856404",
              textAlign: "center",
              fontWeight: "500"
            }}
          >
            {saveStatus}
          </div>
        )}

        {/* Mission Section */}
        <div className="admin-form-about">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#2c3e50", fontSize: "1.2em" }}>
              Mission Statement
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.mission)} words, {getCharCount(about.mission)} characters
            </small>
          </div>

          <textarea
            name="mission"
            className="input-about"
            value={about.mission}
            placeholder="Enter PTC's mission statement - what the institution aims to achieve and its core purpose..."
            onChange={handleChange}
            rows={5}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
          />
          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'block' }}>Inner Card Image (recommended W:690 H:720)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, setInnerImageFile, setInnerImagePreview)} />
            {innerImagePreview && <img src={innerImagePreview} alt="inner-preview" style={{ maxWidth: 320, marginTop: 8, borderRadius: 8 }} />}
          </div>
        </div>

        {/* Vision Section */}
        <div className="admin-form-about">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#2c3e50", fontSize: "1.2em" }}>
              Vision Statement
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.vision)} words, {getCharCount(about.vision)} characters
            </small>
          </div>

          <textarea
            name="vision"
            className="input-about"
            value={about.vision}
            placeholder="Enter PTC's vision statement - the institution's aspirations and future goals..."
            onChange={handleChange}
            rows={5}
            onFocus={(e) => (e.target.style.borderColor = "#28a745")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
          />
          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'block' }}>Vision Image (recommended W:420 H:144)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, setVisionImageFile, setVisionImagePreview)} />
            {visionImagePreview && <img src={visionImagePreview} alt="vision-preview" style={{ width: 420, height: 144, objectFit: 'cover', marginTop: 8, borderRadius: 6 }} />}
          </div>
        </div>

        {/* History Section */}
        <div className="admin-form-about" style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold", color: "#2c3e50", fontSize: "1.2em" }}>
              History & Background
            </label>
            <small style={{ color: "#6c757d" }}>
              {getWordCount(about.history)} words, {getCharCount(about.history)} characters
            </small>
          </div>

          <textarea
            name="history"
            className="input-about"
            value={about.history}
            placeholder="Enter PTC's history - founding, milestones, achievements, and development over the years..."
            onChange={handleChange}
            rows={8}
            onFocus={(e) => (e.target.style.borderColor = "#ffc107")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
          />
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontWeight: 700 }}>President</label>
            <input className="input-about" placeholder="President Name" value={presidentName} onChange={(e) => setPresidentName(e.target.value)} />
            <input className="input-about" placeholder="Title (e.g., The President)" value={presidentTitle} onChange={(e) => setPresidentTitle(e.target.value)} />
            <label style={{ display: 'block', marginTop: 8 }}>President Image (W370 x H430 recommended)</label>
            <input type="file" accept="image/*" onChange={(e) => { handleFile(e, setPresidentImageFile, setPresidentImagePreview); }} />
            {(presidentImagePreview || (about && about.president_image)) && (
              <img src={presidentImagePreview || about.president_image} alt="president" style={{ width: 185, height: 215, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
            )}
          </div>
        </div>

        {/* Former admins */}
        <div style={{ marginTop: 12 }}>
          <label style={{ fontWeight: 700 }}>Former PTC Administrators</label>
          <div>
            {formerAdmins.map((f, idx) => (
              <div key={idx} style={{ border: '1px solid #eee', padding: 8, marginTop: 8 }}>
                <input className="input-about" placeholder="Name" value={f.name} onChange={(e) => updateFormerAdmin(idx, { name: e.target.value })} />
                <input className="input-about" placeholder="Position" value={f.position} onChange={(e) => updateFormerAdmin(idx, { position: e.target.value })} />
                <input className="input-about" placeholder="Year(s)" value={f.year} onChange={(e) => updateFormerAdmin(idx, { year: e.target.value })} />
                <div style={{ marginTop: 6 }}>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) updateFormerAdmin(idx, { file, preview: URL.createObjectURL(file) });
                  }} />
                  {f.preview && <img src={f.preview} alt={f.name || `former-${idx+1}`} style={{ width: 165, height: 110, objectFit: 'cover', marginLeft: 8 }} />}
                  {!f.preview && f.image && <img src={f.image} alt={f.name || `former-${idx+1}`} style={{ width: 165, height: 110, objectFit: 'cover', marginLeft: 8 }} />}
                </div>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => removeFormerAdmin(idx)} className="btn-about">Remove</button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <button onClick={addFormerAdmin} className="btn-about">Add Former Admin</button>
            </div>
          </div>
        </div>

        {/* Images for mission/vision and core values/hymn */}
        <div style={{ marginTop: 12 }}>
          <label style={{ fontWeight: 700 }}>Mission Image (W420 x H144 recommended)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFile(e, setMissionImageFile, setMissionImagePreview)} />
          {missionImagePreview && <img src={missionImagePreview} alt="mission-preview" style={{ width: 420, height: 144, objectFit: 'cover', display: 'block', marginTop: 8 }} />}
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontWeight: 700 }}>Core Values</label>
          <textarea className="input-about" rows={4} value={coreValues} onChange={(e) => setCoreValues(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontWeight: 700 }}>Hymn Left</label>
          <textarea className="input-about" rows={6} value={hymnLeft} onChange={(e) => setHymnLeft(e.target.value)} />
          <label style={{ fontWeight: 700, marginTop: 8 }}>Hymn Right</label>
          <textarea className="input-about" rows={6} value={hymnRight} onChange={(e) => setHymnRight(e.target.value)} />
        </div>

        {/* Save Button */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            className="btn-about primary"
            onClick={handleSave}
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Saving..." : "Save About Information"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAbout;