import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


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

  // Styles for background and card
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
    background: "rgba(255,255,255,0.97)",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
    padding: "40px 32px 32px 32px",
    maxWidth: "1200px",
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
  <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ color: '#2c3e50', margin: '0', marginTop: '60px' }}>Admin Dashboard</h1>
            <p style={{ color: '#6c757d', margin: '5px 0 0 0' }}>
              Welcome back, {adminName}!
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
        {/* Management Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* ...existing code for management cards... */}
          <Link to="/admin/announcements" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '25px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}> Manage Announcements</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Create, edit, and manage campus announcements and news</p>
            </div>
          </Link>
          <Link to="/admin/academic-info" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '25px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#d1ecf1', borderLeft: '4px solid #17a2b8', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>Manage Academic Info</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Update academic programs and course information</p>
            </div>
          </Link>
          <Link to="/admin/about" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '25px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#d4edda', borderLeft: '4px solid #28a745', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}> Manage About PTC</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Edit mission, vision, and history information</p>
            </div>
          </Link>
          <Link to="/admin/offices" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '25px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Manage Office Directory</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Add and update office locations and contact information</p>
            </div>
          </Link>
          <Link to="/admin/maps" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '25px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#e2e3f0', borderLeft: '4px solid #6f42c1', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3d1a78' }}>Manage Campus Maps</h3>
              <p style={{ margin: '0', color: '#6c757d' }}>Upload and manage campus maps and layouts</p>
            </div>
          </Link>
        </div>
        {/* Quick Stats */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ color: '#495057', marginBottom: '10px' }}>Quick Actions</h4>
          <p style={{ color: '#6c757d', margin: '0' }}>Select any management option above to get started. All changes are saved automatically.</p>
        </div>
      </div>
    </div>
  );
}