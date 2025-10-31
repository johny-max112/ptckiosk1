import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AboutPTC() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setLoading(true);
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
    padding: "0px 24px 32px 24px",
    maxWidth: "800px",
    width: "calc(100% - 40px)",
    margin: "60px auto 0 auto",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    boxSizing: "border-box",
    overflowWrap: "break-word"
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

  const embeddedHeaderStyle = {
    backgroundColor: "#fdd835",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "20px",
    flexWrap: "nowrap",
    overflow: "hidden",
    boxSizing: "border-box",
    marginLeft: "-24px",
    marginRight: "-24px"
  };

  const embeddedLogoStyle = {
    width: "56px",
    height: "56px",
    objectFit: "contain",
    marginRight: "6px",
    flexShrink: 0,
    marginLeft: "6px"
  };

  const embeddedTitleStyle = {
    fontSize: "clamp(1.2em, 2vw, 1.6em)",
    fontWeight: "bold",
    color: "#2e7d32",
    cursor: "pointer",
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    flex: "1 1 auto"
  };

  if (!data) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <div style={backgroundStyle}></div>
        <div style={cardStyle}>
          <img src="/pateros.png" alt="PTC Logo" style={logoStyle} />
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
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <div style={embeddedHeaderStyle}>
          <img src="/ptcround.png" alt="PTC Logo" style={embeddedLogoStyle} />
          <span onClick={() => navigate("/")} style={embeddedTitleStyle}>
            Pateros Technological College
          </span>
        </div>
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginBottom: "30px" }}>About PTC</h2>
        <h3 style={{ color: "#388e3c", marginTop: "30px" }}>Mission</h3>
        <p style={{ color: "#495057", marginBottom: "20px" }}>{data.mission}</p>
        <h3 style={{ color: "#388e3c" }}>Vision</h3>
        <p style={{ color: "#495057", marginBottom: "20px" }}>{data.vision}</p>
        <h3 style={{ color: "#388e3c" }}>History</h3>
        <p style={{ color: "#495057", marginBottom: "20px" }}>{data.history}</p>
      </div>
    </div>
  );
}
