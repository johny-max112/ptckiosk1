import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";
import "./CampusMap.css";

export default function CampusMap() {
  const navigate = useNavigate();
  const [maps, setMaps] = useState([]);
  const [selectedCampusId, setSelectedCampusId] = useState(null); // null = show all
  const [loading, setLoading] = useState(true);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const prevRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    const fetchMaps = async (showLoading = false) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (showLoading) setLoading(true);
      try {
        const url = api("/api/maps");
        console.debug('[CampusMap] fetching', url);
        const res = await axios.get(url, {
          headers: { "Cache-Control": "no-cache" },
        });
        console.debug('[CampusMap] fetch response status', res.status);
        if (!mountedRef.current) return;
        const json = JSON.stringify(res.data || []);
        if (json !== prevRef.current) {
          // dedupe by id in case backend returns duplicates
          const rows = Array.isArray(res.data) ? res.data : [];
          const seen = new Set();
          const unique = [];
          rows.forEach(r => {
            if (!r || typeof r.id === 'undefined' || r.id === null) return;
            if (!seen.has(r.id)) {
              seen.add(r.id);
              unique.push(r);
            }
          });
          setMaps(unique);
          prevRef.current = json;
        }
      } catch (err) {
        try {
          const info = {
            message: err.message,
            code: err.code,
            url: err.config && err.config.url,
            status: err.response && err.response.status,
            responseData: err.response && err.response.data,
          };
          console.error('[CampusMap] Error fetching maps:', info, err);
        } catch (e) {
          console.error('[CampusMap] Error fetching maps (failed to build debug info):', err);
        }
      } finally {
        inFlightRef.current = false;
        if (showLoading && mountedRef.current) setLoading(false);
      }
    };

    fetchMaps(true);
    const interval = setInterval(() => fetchMaps(false), 30000);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // simple campus selection helpers
  const campuses = Array.from(new Map(maps.map(m => [m.campus_id || m.id, { campus_id: m.campus_id, campus_name: m.campus_name }])).values());
  const handleSelectCampus = (campusId) => {
    setSelectedCampusId(campusId);
  };

  return (
    <div className="campusmap-root">
      <div
        className="campusmap-background"
        style={{ backgroundImage: `url('/pateros.png')` }}
      ></div>

      <div className="campusmap-card">
        <div className="campusmap-header">
          <img src="/ptcround.png" alt="PTC Logo" className="campusmap-logo" />
          <span
            onClick={() => navigate("/")}
            className="campusmap-title"
            tabIndex={0}
            role="button"
            aria-label="Go to homepage"
          >
            Pateros Technological College
          </span>
        </div>

        {/* Selection header: choose which campus to view */}
        <div className="campusmap-selection-header">
          <div className="selection-title">Select Campus</div>
          <div className="selection-buttons">
            <button className={`btn-map ${selectedCampusId === null ? 'active' : ''}`} onClick={() => handleSelectCampus(null)}>All</button>
            {campuses.map(c => (
              <button key={c.campus_id || c.campus_name} className={`btn-map ${selectedCampusId === c.campus_id ? 'active' : ''}`} onClick={() => handleSelectCampus(c.campus_id)}>
                {c.campus_name || `Campus ${c.campus_id}`}
              </button>
            ))}
          </div>
        </div>

        <div className="campusmap-card-body">
          {loading ? (
            <div className="campusmap-skeletons" style={{ display: "grid", gap: 12 }}>
              <div style={{ height: 140, borderRadius: 8, background: "#f0f0f0" }} />
              <div style={{ height: 140, borderRadius: 8, background: "#f0f0f0" }} />
            </div>
          ) : maps.length === 0 ? (
            <p>No maps available</p>
          ) : (
            <>
              {/* selection buttons moved to the top selection header */}

              {(selectedCampusId === null ? maps : maps.filter(m => String(m.campus_id) === String(selectedCampusId))).map((map) => (
                <div key={map.id} className={`campusmap-campuscard ${selectedCampusId && String(map.campus_id) === String(selectedCampusId) ? 'selected' : ''}`}>
                  <div className="campusmap-card-gradient-header">
                    <span>Campus Map</span>
                  </div>
                  <h3 className="campusmap-campusname">
                    {map.campus_name || `Campus ${map.campus_id}`}
                  </h3>
                  {map.address && <p className="campusmap-campusaddress">{map.address}</p>}

                  <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
                    {map.embed_map_link && (
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>Map View</div>
                        <div style={{ width: '100%' }}>
                          <iframe
                            title={`map-${map.id}`}
                            src={map.embed_map_link}
                            width="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        {map.description_map && <p className="campusmap-campusdesc">{map.description_map}</p>}
                      </div>
                    )}

                    {map.embed_streetview_link && (
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>Street View</div>
                        <div style={{ width: '100%' }}>
                          <iframe
                            title={`streetview-${map.id}`}
                            src={map.embed_streetview_link}
                            width="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        {map.description_streetview && <p className="campusmap-campusdesc">{map.description_streetview}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
