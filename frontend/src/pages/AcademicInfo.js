import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AcademicInfo.css';

// Section components are rendered on their own pages; imports removed to avoid unused warnings

export default function AcademicInfo() {
  const navigate = useNavigate();
  // This page only shows the selection buttons; detailed content opens on its own page

  return (
    <div className="page-root">
      <div className="background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/pateros.png)` }} />
      <div className="card">
        <div className="embedded-header">
          <img src="/ptcround.png" alt="PTC Logo" className="embedded-logo" />
          <span onClick={() => navigate('/')} className="embedded-title">Pateros Technological College</span>
        </div>

        <div className="outer-card">
          {/* Single attached card: header and selection are visually connected */}
          <div className="attached-card">
            <div className="academic-info-header attached">
              <h2>Academic Information</h2>
            </div>

            <div className="selection-inner attached">
              <button className="select-btn" onClick={() => navigate('/academic/requirements')}>Procedures and Requirements</button>
              <button className="select-btn" onClick={() => navigate('/academic/programs')}>Offered Programs</button>
              <button className="select-btn" onClick={() => navigate('/academic/scholarship')}>Scholarship</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}