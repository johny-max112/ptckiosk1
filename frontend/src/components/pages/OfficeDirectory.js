import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";
import "./OfficeDirectory.css";

export default function OfficeDirectory() {
  const navigate = useNavigate();
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const prevRef = useRef(null);
  useEffect(() => {
    mountedRef.current = true;

    const fetchOffices = async (showLoading = false) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (showLoading) setLoading(true);
      try {
        // use the api helper so we don't hardcode local IPs here
        const url = api('/api/offices');
        console.debug('[OfficeDirectory] fetching', url);
        const res = await axios.get(url, { headers: { 'Cache-Control': 'no-cache' } });
        console.debug('[OfficeDirectory] fetch response status', res.status);
        if (!mountedRef.current) return;
        const json = JSON.stringify(res.data || []);
        if (json !== prevRef.current) {
          setOffices(res.data);
          prevRef.current = json;
          console.debug('[OfficeDirectory] setOffices length', (res.data || []).length, 'sample', (res.data || [])[0]);
        }
      } catch (err) {
        // improve debugging output so we can see request URL and backend status
        try {
          const info = {
            message: err.message,
            code: err.code,
            url: err.config && err.config.url,
            status: err.response && err.response.status,
            responseData: err.response && err.response.data,
          };
          console.error('[OfficeDirectory] Error fetching offices:', info, err);
        } catch (e) {
          console.error('[OfficeDirectory] Error fetching offices (failed to build debug info):', err);
        }
        if (mountedRef.current) setError(err.message || 'Failed to load office data');
      } finally {
        inFlightRef.current = false;
        if (showLoading && mountedRef.current) setLoading(false);
      }
    };

    fetchOffices(true);
    const interval = setInterval(() => fetchOffices(false), 30000);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // Group offices by campus
  const officesByCampus = offices.reduce((acc, office) => {
    let campusName;
    if (office.campus_name) {
      campusName = office.campus_name;
    } else {
      campusName = `Campus ${office.campus_id} (Name Missing)`;
    }
    if (!acc[campusName]) {
      acc[campusName] = [];
    }
    acc[campusName].push(office);
    return acc;
  }, {});

  // Build a campus list with ids (use first office found per campus)
  const campuses = Object.entries(officesByCampus).map(([name, items]) => ({
    id: items[0]?.campus_id || null,
    name
  }));

  // Visual styles moved into external stylesheet OfficeDirectory.css

  // Close modal on Escape
  useEffect(() => {
    if (!selectedOffice) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedOffice(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedOffice]);
  if (loading) {
    // Render a skeleton UI while loading to give better visual feedback
    const skeletonCards = Array.from({ length: 6 });
    return (
      <div className="office-page-root">
        <div className="office-background" style={{ backgroundImage: "url('/pateros.png')" }}></div>
        <div className="office-card">
          <button className="office-back-button" onClick={() => navigate("/")}>Pateros Technological College</button>
          <img src="/ptcround.png" alt="PTC Logo" className="office-logo" />
          <div className="office-embedded-header">
            <img src="/ptcround.png" alt="PTC Logo" className="office-embedded-logo" />
            <span className="office-embedded-title">Pateros Technological College</span>
          </div>
          <h2 style={{ marginTop: 8 }}>Office Directory</h2>

          <div className="office-collection">
            <div className="office-inner-card">
              <div className="office-campus-header"><h3>Loading offices</h3></div>
              <div className="office-campus-content">
                <div className="office-grid">
                  {skeletonCards.map((_, i) => (
                    <div key={i} className="office-office-card skeleton-card" aria-hidden="true">
                      <div className="skeleton-line skeleton-title" />
                      <div className="skeleton-line skeleton-desc" />
                      <div className="skeleton-line skeleton-meta" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="office-page-root">
      <div className="office-background" style={{ backgroundImage: "url('/pateros.png')" }}></div>
      <div className="office-card">
        <div className="office-embedded-header">
          <img src="/ptcround.png" alt="PTC Logo" className="office-embedded-logo" />
          <span onClick={() => navigate("/")} className="office-embedded-title">
            Pateros Technological College
          </span>
        </div>
        
        {error ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#fff3f3",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            border: "1px solid #ffbcbc"
          }}>
            <h3 style={{ color: "#a71d2a" }}>Unable to load office information</h3>
            <p style={{ color: "#6c757d" }}>{error}</p>
            <p style={{ color: "#6c757d" }}>If you're running this locally, ensure the API server is reachable and the app's API base URL is configured (see <code>REACT_APP_API_URL</code>).</p>
          </div>
        ) : offices.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6c757d" }}>No office information available</h3>
            <p style={{ color: "#6c757d" }}>Please check back later or reach out to the administration.</p>
          </div>
        ) : (
          <div className="office-collection">
            {/* If no campus selected, show selection cards */}
              {!selectedCampus ? (
              <div className="office-selection-wrapper">
                {campuses.map(c => (
                  <div key={c.id || c.name} className="office-selection-inner attached">
                    <button className="office-select-btn" onClick={() => setSelectedCampus(c)}>{c.name}</button>
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                const campusOffices = offices.filter(o => String(o.campus_id) === String(selectedCampus.id));
                return (
                  <div className="office-inner-card">
                    <div className="office-campus-header office-campus-header--green">
                      <button className="office-campus-back" onClick={() => setSelectedCampus(null)} aria-label="Back to campuses"> ←</button>
                      <h3 className="office-campus-title">{selectedCampus.name}</h3>
                    </div>
                    <div className="office-campus-content">
                      <div className="office-grid">
                        {campusOffices.length === 0 ? (
                          <div style={{ padding: 16 }}>No offices listed for this campus.</div>
                        ) : (
                          campusOffices.map(office => (
                            <div key={office.id} className="office-office-card" onClick={() => setSelectedOffice(office)} style={{ cursor: 'pointer' }}>
                              <h4 className="office-office-title">{office.name}</h4>
                              {office.description && <p className="office-office-desc">{office.description}</p>}
                              <div className="office-office-meta">
                                {office.room && (<div style={{ display: 'flex', alignItems: 'center' }}><span className="office-meta-label">Room:</span><span style={{ color: '#495057', marginLeft: 10 }}>{office.room}</span></div>)}
                                {office.office_hours && (<div style={{ display: 'flex', alignItems: 'center' }}><span className="office-meta-label">Hours:</span><span style={{ color: '#495057', marginLeft: 10 }}>{office.office_hours}</span></div>)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
            {/* Modal for office details */}
            {selectedOffice && (
              <div className="office-modal-overlay" onClick={() => setSelectedOffice(null)}>
                <div className="office-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                  <button className="office-modal-close" onClick={() => setSelectedOffice(null)} aria-label="Close">×</button>
                  <h2 style={{ marginTop: 0 }}>{selectedOffice.name}</h2>
                  {selectedOffice.campus_name && <p style={{ fontWeight: 700 }}>{selectedOffice.campus_name}</p>}
                  {selectedOffice.description && <p style={{ fontStyle: 'italic' }}>{selectedOffice.description}</p>}
                  <div style={{ marginTop: 12 }}>
                    {selectedOffice.contact && (
                      <p><strong>Contact:</strong> {selectedOffice.contact}</p>
                    )}
                    {selectedOffice.room && (
                      <p><strong>Room:</strong> {selectedOffice.room}</p>
                    )}
                    {selectedOffice.office_hours && (
                      <p><strong>Hours:</strong> {selectedOffice.office_hours}</p>
                    )}
                    {selectedOffice.email && (
                      <p><strong>Email:</strong> {selectedOffice.email}</p>
                    )}
                    {selectedOffice.phone && (
                      <p><strong>Phone:</strong> {selectedOffice.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}