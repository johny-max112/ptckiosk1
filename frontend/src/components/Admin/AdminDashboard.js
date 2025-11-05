import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');
    if (!token) {
      navigate('/admin');
      return;
    }
    setAdminName(name || 'Administrator');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin');
  };

  return (
    <div className="admin-page-dashboard">
      <div className="admin-bg-dashboard" style={{ backgroundImage: "url('/pateros.png')" }}></div>
      <div className="admin-card-dashboard">
        <img src="/ptcround.png" alt="PTC Logo" className="admin-logo" />
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="welcome-text">Welcome back, {adminName}!</p>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>

        {/* Management Cards */}
        <div className="admin-cards-grid">
          {/* ...existing code for management cards... */}
          <Link to="/admin/announcements" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="admin-card-tile" style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}> Manage Announcements</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Create, edit, and manage campus announcements and news</p>
            </div>
          </Link>
          <Link to="/admin/academic-info" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="admin-card-tile" style={{ backgroundColor: '#d1ecf1', borderLeft: '4px solid #17a2b8' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>Manage Academic Info</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Update academic programs and course information</p>
            </div>
          </Link>
          <Link to="/admin/about" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="admin-card-tile" style={{ backgroundColor: '#d4edda', borderLeft: '4px solid #28a745' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}> Manage About PTC</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Edit mission, vision, and history information</p>
            </div>
          </Link>
          <Link to="/admin/offices" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="admin-card-tile" style={{ backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Manage Office Directory</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Add and update office locations and contact information</p>
            </div>
          </Link>
          <Link to="/admin/maps" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="admin-card-tile" style={{ backgroundColor: '#e2e3f0', borderLeft: '4px solid #6f42c1' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3d1a78' }}>Manage Campus Maps</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Upload and manage campus maps and layouts</p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="quick-actions">
          <h4>Quick Actions</h4>
          <p>Select any management option above to get started. All changes are saved automatically.</p>
        </div>
      </div>
    </div>
  );
}