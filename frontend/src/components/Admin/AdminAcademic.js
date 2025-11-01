import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAcademic.css';

const sections = [
  { key: 'requirements', label: 'Requirements & Procedure' },
  { key: 'programs', label: 'Offered Programs' },
  { key: 'scholarship', label: 'Scholarship' }
];

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

let API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Normalize API value in case environment provided a shorthand like ":5000/api"
function normalizeApi(api) {
  if (!api) return api;
  // if starts with ':' e.g. ':5000/api' -> prepend http://localhost
  if (api.startsWith(':')) return `http://localhost${api}`;
  // if starts with '//' add protocol
  if (api.startsWith('//')) return `${window.location.protocol}${api}`;
  return api;
}

API = normalizeApi(API);
console.debug('[AdminAcademic] Using API base:', API);

export default function AdminAcademic() {
  const navigate = useNavigate();
  const [section, setSection] = useState('programs');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/academic/${section}`, { headers: getAuthHeaders() });
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching admin academic entries:', err?.response || err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/admin';
        return;
      }
      alert('Error fetching entries. Please login if required.');
    } finally { setLoading(false); }
  }, [section]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.title || !form.content) return alert('Please fill both title and content');
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/admin/academic/${section}/${editingId}`, form, { headers: getAuthHeaders() });
        setEditingId(null);
      } else {
        await axios.post(`${API}/admin/academic/${section}`, form, { headers: getAuthHeaders() });
      }
      setForm({ title: '', content: '' });
      fetchItems();
    } catch (err) {
      console.error('Error saving admin academic entry:', err?.response || err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/admin';
        return;
      }
      alert('Error saving entry');
    } finally { setLoading(false); }
  };

  const handleEdit = (it) => { setForm({ title: it.title, content: it.content }); setEditingId(it.id); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/admin/academic/${section}/${id}`, { headers: getAuthHeaders() });
      fetchItems();
    } catch (err) {
      console.error('Error deleting admin academic entry:', err?.response || err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/admin';
        return;
      }
      alert('Error deleting entry');
    } finally { setLoading(false); }
  };


  
  return (
    <div className="admin-page-academic">
      <div className="admin-bg-academic" style={{ backgroundImage: "url('/pateros.png')" }}></div>
         <div className="admin-card-academic">
           <div className="admin-back-container">
             <button onClick={() => navigate('/admin/dashboard')} className="academic-btn admin-back-btn">← Back to Dashboard</button>
           </div>
           <h2 style={{ color: '#2e7d32', margin: 0, textAlign: 'center', marginBottom: 12 }}>Admin — Academic</h2>
        <div className="academic-sections">
          {sections.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} className={`academic-btn ${section===s.key? 'active':''}`} style={{ padding: '8px 14px' }}>{s.label}</button>
          ))}
        </div>


        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12 }}>
              <h3>{editingId ? 'Edit Entry' : 'Add New Entry'}</h3>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input-academic" />
              <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" rows={6} className="input-academic" />
              <div style={{ marginTop: 8 }}>
                <button onClick={handleSave} disabled={loading} className="academic-btn active">{editingId? 'Update':'Add'}</button>
                {editingId && <button onClick={() => { setEditingId(null); setForm({ title:'', content:'' }); }} style={{ marginLeft: 8 }} className="academic-btn">Cancel</button>}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Entries ({section})</h3>
            {loading ? <p>Loading...</p> : (
              items.length === 0 ? <p>No entries</p> : (
                items.map(it => (
                  <div key={it.id} className="academic-list-item">
                    <h4 style={{ margin: 0 }}>{it.title}</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{it.content}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(it)} className="academic-btn active" style={{ padding: '6px 10px' }}>Edit</button>
                      <button onClick={() => handleDelete(it.id)} className="academic-btn" style={{ padding: '6px 10px', background: '#ffc107', color: '#2e7d32' }}>Delete</button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
