import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AboutPTC.css";

export default function AboutPTC() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const prevRef = useRef(null);
    useEffect(() => {
      mountedRef.current = true;

      const fetchAbout = async (showLoading = false) => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        if (showLoading) {
          setData(null);
        }
        try {
            
            
            const apiBase = process.env.REACT_APP_API_URL || '';
            const res = await axios.get(`${apiBase}/api/about`, { headers: { 'Cache-Control': 'no-cache' } });
          if (!mountedRef.current) return;
          const json = JSON.stringify(res.data || {});
          if (json !== prevRef.current) {
            setData(res.data);
            prevRef.current = json;
          }
        } catch (err) {
          console.error(err);
        } finally {
          inFlightRef.current = false;
        }
      };

      fetchAbout(true);
      const interval = setInterval(() => fetchAbout(false), 30000);
      return () => {
        mountedRef.current = false;
        clearInterval(interval);
      };
    }, []);

  
  if (!data) {
    return (
      <div className="about-page-root">
        <div className="about-background" style={{ backgroundImage: "url('/pateros.png')" }}></div>
        <div className="about-card">
          
          <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>About PTC</h2>
          {/* Skeleton placeholders for mission / vision / history */}
          <div style={{ marginTop: 20, display: "grid", gap: 12, padding: "0 20px" }}>
            <div style={{ height: 18, width: "70%", background: "#e0e0e0", borderRadius: 6 }} />
            <div style={{ height: 14, width: "100%", background: "#f0f0f0", borderRadius: 6 }} />
            <div style={{ height: 14, width: "100%", background: "#f0f0f0", borderRadius: 6 }} />
            <div style={{ height: 14, width: "90%", background: "#f0f0f0", borderRadius: 6 }} />
            <div style={{ height: 18, width: "40%", background: "#e0e0e0", borderRadius: 6, marginTop: 18 }} />
            <div style={{ height: 14, width: "100%", background: "#f0f0f0", borderRadius: 6 }} />
            <div style={{ height: 14, width: "100%", background: "#f0f0f0", borderRadius: 6 }} />
            <div style={{ height: 18, width: "55%", background: "#e0e0e0", borderRadius: 6, marginTop: 18 }} />
            <div style={{ height: 14, width: "100%", background: "#f0f0f0", borderRadius: 6 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page-root">
      <div className="about-background" style={{ backgroundImage: "url('/pateros.png')" }}></div>
      <div className="about-card">
        <div className="about-embedded-header">
          <img src="/ptcround.png" alt="PTC Logo" className="about-embedded-logo" />
          <span onClick={() => navigate("/")} className="about-embedded-title">
            Pateros Technological College
          </span>
        </div>
        {/* Inner card with its own header (uses announcement campus colors) */}
        <div className="about-inner-card">
          <div className="inner-card-header">
            <h3>About PTC</h3>
          </div>
          <div className="inner-card-content">
            <h3 className="about-section-title" style={{ marginTop: "0" }}>Mission</h3>
            <p className="about-text">{data.mission}</p>

            <h3 className="about-section-title">Vision</h3>
            <p className="about-text">{data.vision}</p>

            <h3 className="about-section-title">History</h3>
            <p className="about-text">{data.history}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
