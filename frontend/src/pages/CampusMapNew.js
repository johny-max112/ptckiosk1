import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import "./CampusMap.css";

export default function CampusMap() {
  const navigate = useNavigate();
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const dragStart = useRef({ x: 0, y: 0 });

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
        const res = await axios.get(api("/api/maps"), {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!mountedRef.current) return;
        const json = JSON.stringify(res.data || []);
        if (json !== prevRef.current) {
          setMaps(res.data);
          prevRef.current = json;
        }
      } catch (err) {
        console.error(err);
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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
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

        <div className="campusmap-card-body">
          {loading ? (
            <div className="campusmap-skeletons" style={{ display: "grid", gap: 12 }}>
              <div style={{ height: 140, borderRadius: 8, background: "#f0f0f0" }} />
              <div style={{ height: 140, borderRadius: 8, background: "#f0f0f0" }} />
            </div>
          ) : maps.length === 0 ? (
            <p>No maps available</p>
          ) : (
            maps.map((map) => (
              <div key={map.id} className="campusmap-campuscard">
                <div className="campusmap-card-gradient-header">
                  <span>Campus Map</span>
                </div>
                <h3 className="campusmap-campusname">
                  {map.campus_name || `Campus ${map.campus_id}`}
                </h3>
                {map.address && <p className="campusmap-campusaddress">{map.address}</p>}

                {map.image_path && (
                  <img
                    src={api(map.image_path)}
                    alt={map.description}
                    onClick={() => {
                      setSelectedMap(map);
                      setScale(1);
                      setPosition({ x: 0, y: 0 });
                    }}
                    className="campusmap-campusimg"
                    draggable={false}
                  />
                )}

                <p className="campusmap-campusdesc">{map.description}</p>
              </div>
            ))
          )}

          <div className="campusmap-iframe-container">
            <iframe
              title="PTC Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12731.606932099821!2d121.0608873657026!3d14.558018636207075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8863fae6025%3A0xe4f1a76191156148!2sPateros%20Technological%20College!5e1!3m2!1sen!2sph!4v1761880844076!5m2!1sen!2sph"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {selectedMap && (
        <div
          className="campusmap-overlay"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <button onClick={() => setSelectedMap(null)} className="campusmap-closebtn">
            ← Back
          </button>

          <div className="campusmap-zoomcontrols">
            <button onClick={() => setScale((prev) => Math.min(prev + 0.2, 2))} className="campusmap-zoombtn">
              Zoom In
            </button>
            <button onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))} className="campusmap-zoombtn">
              Zoom Out
            </button>
            <button onClick={resetZoom} className="campusmap-zoombtn">
              Reset
            </button>
          </div>

          <div
            className="campusmap-imagecontainer"
            style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
          >
            <img
              src={api(selectedMap.image_path)}
              alt={selectedMap.description}
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? "none" : "transform 0.3s ease",
              }}
              className="campusmap-fullscreenimg"
              draggable={false}
            />
          </div>

          <p className="campusmap-overlaydesc">{selectedMap.description}</p>
        </div>
      )}
    </div>
  );
}
