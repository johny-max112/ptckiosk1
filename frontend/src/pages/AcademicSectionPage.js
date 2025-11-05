import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RequirementsProcedure from '../components/AcademicSections/RequirementsProcedure/RequirementsProcedure';
import OfferedPrograms from '../components/AcademicSections/OfferedPrograms/OfferedPrograms';
import Scholarship from '../components/AcademicSections/Scholarship/Scholarship';
import './AcademicInfo.css';

const sectionTitleMap = {
  requirements: 'Procedures & Requirements',
  programs: 'Offered Programs',
  scholarship: 'Scholarship'
};

export default function AcademicSectionPage() {
  const { section } = useParams();
  const navigate = useNavigate();

  const renderSection = () => {
    switch (section) {
      case 'requirements': return <RequirementsProcedure />;
      case 'programs': return <OfferedPrograms />;
      case 'scholarship': return <Scholarship />;
      default: return <p>Unknown section</p>;
    }
  };

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
          <div className="attached-card">
            <div className="academic-info-header attached" role="button" tabIndex={0} onClick={() => navigate('/academic')} onKeyDown={(e) => e.key === 'Enter' && navigate('/academic')}>
              <button className="back-btn" onClick={(e) => { e.stopPropagation(); navigate('/academic'); }} aria-label="Back to selections">←</button>
              <h2>Academic Information</h2>
            </div>
            <div className="program-card" style={{ margin: 18 }}>
              <div className="program-content">
                <h3 className="section-title">{sectionTitleMap[section] || 'Academic'}</h3>
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
