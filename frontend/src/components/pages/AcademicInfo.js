import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AcademicInfo.css';



export default function AcademicInfo() {
  const navigate = useNavigate();
  // mga button dito sa page; 

  return (
    <div className="page-root">
  <div className="academic-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/pateros.png)` }} />
  <div className="academic-card">
        <div className="embedded-header">
          <img src="/ptcround.png" alt="PTC Logo" className="embedded-logo" />
          <span
            onClick={() => navigate('/')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            tabIndex={0}
            className="embedded-title"
          >Pateros Technological College</span>
        </div>

        <div className="outer-card">
          {/* connected sa card ung header na ginto */}
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