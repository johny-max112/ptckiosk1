import React from "react";
import { useNavigate } from "react-router-dom";

export default function KioskHome() {
  const navigate = useNavigate();

  

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.92)",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
    padding: "40px 32px 32px 32px",
    maxWidth: "700px",
    margin: "60px auto 0 auto",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    border: "3px solid #ffc107"
  };

  const logoStyle = {
    width: "110px",
    height: "110px",
    objectFit: "contain",
    position: "absolute",
    top: "-55px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "white",
    borderRadius: "50%",
    boxShadow: "0 2px 12px rgba(44,62,80,0.12)",
    border: "3px solid #2e7d32"
  };

  const buttonStyle = {
    width: "180px",
    height: "100px",
    fontSize: "1.2rem",
    borderRadius: "14px",
    cursor: "pointer",
    background: "linear-gradient(135deg, #43a047 60%, #ffc107 100%)",
    color: "white",
    border: "2px solid #388e3c",
    boxShadow: "0 2px 8px rgba(44,62,80,0.12)",
    margin: "18px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s, transform 0.2s"
  };

  const buttonIconStyle = {
    fontSize: "2.2rem",
    marginBottom: "8px"
  };

  const [touched, setTouched] = React.useState(() => {
    return localStorage.getItem("kioskTouched") === "true";
  });

  const handleTouch = () => {
    if (!touched) {
      localStorage.setItem("kioskTouched", "true");
      setTouched(true);
      navigate("/");
    }
  };

  // Auto-reset after 1 minute of inactivity
  React.useEffect(() => {
    let timeout;

    const resetToWelcome = () => {
      setTouched(false);
      localStorage.removeItem("kioskTouched");
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(resetToWelcome, 1 * 60 * 1000);
    };

    const events = ["click", "touchstart", "mousemove", "keydown"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [touched]);

  if (!touched) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "url('/pateros.png') center center / cover no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          cursor: "pointer"
        }}
        onClick={handleTouch}
        onTouchStart={handleTouch}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1
        }}></div>

        <div style={{ textAlign: "center", zIndex: 2, position: "relative" }}>
          <img src="/ptcround.png" alt="PTC Logo" style={{ width: "160px", marginBottom: "32px" }} />
          <h1 style={{ fontWeight: "bold", color: "#fff", fontSize: "2.8rem", marginBottom: "18px", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            Welcome to Pateros Technological College
            <br />
            Smart Kiosk
          </h1>
          <p style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "12px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            Touch anywhere to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/pateros.png')", // Replace with your actual image
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.85) contrast(1.1)",
        zIndex: 1,
        pointerEvents: "none"
      }}></div>
      <div style={cardStyle}>
        <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
        <h1 style={{ fontWeight: "bold", color: "#388e3c", fontSize: "2.3rem", marginTop: "70px", marginBottom: "12px", textShadow: "0 2px 8px #fffde7" }}>
          Welcome to PTC Smart Kiosk
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#333", marginBottom: "32px" }}>
          Tap a button below to access campus information and services
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <button style={buttonStyle} onClick={() => navigate("/announcements")}>
            <span role="img" aria-label="Announcements" style={buttonIconStyle}>📢</span>
            Announcements
          </button>
          <button style={buttonStyle} onClick={() => navigate("/academic")}>
            <span role="img" aria-label="Academic Info" style={buttonIconStyle}>📝</span>
            Academic Info
          </button>
          <button style={buttonStyle} onClick={() => navigate("/about")}>
            <span role="img" aria-label="About PTC" style={buttonIconStyle}>🏫</span>
            About PTC
          </button>
          <button style={buttonStyle} onClick={() => navigate("/directory")}>
            <span role="img" aria-label="Office Directory" style={buttonIconStyle}>📇</span>
            Office Directory
          </button>
          <button style={buttonStyle} onClick={() => navigate("/map")}>
            <span role="img" aria-label="Campus Map" style={buttonIconStyle}>🗺️</span>
            Campus Map
          </button>
        </div>
      </div>
    </div>
  );
}
