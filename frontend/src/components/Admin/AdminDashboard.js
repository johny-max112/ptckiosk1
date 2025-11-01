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
    <div className="admin-dashboard-container">
      <div
  className="background"
  style={{ backgroundImage: "url('/pateros.png')" }}
></div>
      <div className="dashboard-card">
        <img src="/ptcround.png" alt="PTC Logo" className="logo" />

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="welcome-text">Welcome back, {adminName}!</p>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>

        {/* Management Cards */}
        <div className="management-grid">
          <Link to="/admin/announcements" className="management-link">
            <div className="management-card announcements">
              <h3>Manage Announcements</h3>
              <p>Create, edit, and manage campus announcements and news</p>
            </div>
          </Link>

          <Link to="/admin/academic-info" className="management-link">
            <div className="management-card academic">
              <h3>Manage Academic Info</h3>
              <p>Update academic programs and course information</p>
            </div>
          </Link>

          <Link to="/admin/about" className="management-link">
            <div className="management-card about">
              <h3>Manage About PTC</h3>
              <p>Edit mission, vision, and history information</p>
            </div>
          </Link>

          <Link to="/admin/offices" className="management-link">
            <div className="management-card offices">
              <h3>Manage Office Directory</h3>
              <p>Add and update office locations and contact information</p>
            </div>
          </Link>

          <Link to="/admin/maps" className="management-link">
            <div className="management-card maps">
              <h3>Manage Campus Maps</h3>
              <p>Upload and manage campus maps and layouts</p>
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
