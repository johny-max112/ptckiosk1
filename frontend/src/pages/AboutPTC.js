import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AboutPTC() {
  const [data, setData] = useState(null);

    useEffect(() => {
      const fetchAbout = () => {
        axios.get("http://localhost:5000/api/about")
          .then((res) => setData(res.data))
          .catch((err) => console.error(err));
      };
      fetchAbout();
      const interval = setInterval(fetchAbout, 10000);
      return () => clearInterval(interval);
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
    padding: "40px 32px 32px 32px",
    maxWidth: "700px",
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

  if (!data) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <div style={backgroundStyle}></div>
        <div style={cardStyle}>
          <img src="/pateros.png" alt="PTC Logo" style={logoStyle} />
          <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>About PTC</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
  <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>About PTC</h2>
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
