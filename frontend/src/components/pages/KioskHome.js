import React from "react";
import { useNavigate } from "react-router-dom";
import './KioskHome.css';
import { FaFacebook, FaGlobe } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

export default function KioskHome() {
  const navigate = useNavigate();

  const [touched, setTouched] = React.useState(() => {
    return localStorage.getItem("kioskTouched") === "true";
  });

  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [qrValue, setQrValue] = React.useState(null);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTouch = () => {
    if (!touched) {
      localStorage.setItem("kioskTouched", "true");
      setTouched(true);
      navigate("/");
    }
  };

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

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  const pressNavigate = (path) => ({
    onTouchStart: (e) => e.currentTarget.classList.add("touch-pressed"),
    onTouchCancel: (e) => e.currentTarget.classList.remove("touch-pressed"),
    onTouchEnd: (e) => {
      e.currentTarget.classList.remove("touch-pressed");
      setTimeout(() => navigate(path), 80);
    },
    onMouseDown: (e) => e.currentTarget.classList.add("touch-pressed"),
    onMouseLeave: (e) => e.currentTarget.classList.remove("touch-pressed"),
    onMouseUp: (e) => {
      e.currentTarget.classList.remove("touch-pressed");
      setTimeout(() => navigate(path), 80);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") navigate(path);
    },
  });

  if (!touched) {
    return (
      <div
        className="welcome-overlay"
        onClick={handleTouch}
        onTouchStart={handleTouch}
        style={{
          background: `url(${process.env.PUBLIC_URL}/pateros.png) center center / cover no-repeat`,
        }}
      >
        <div className="welcome-backdrop" />
        <div className="welcome-content">
          <img
            src="/ptcround.png"
            alt="PTC Logo"
            style={{ width: "160px", marginBottom: "32px" }}
          />
          <h1>
            Welcome to Pateros Technological College
            <br />
            Smart Kiosk
          </h1>
          <p>Touch anywhere to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div
        className="kiosk-bg"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/pateros.png)` }}
      />

      <div className="kiosk-card">
        <div className="datetime-container">
          <div className="date-text">{formattedDate}</div>
          <div className="time-text">{formattedTime}</div>
        </div>

        <img src="/ptcround.png" alt="PTC Logo" className="kiosk-logo" />
        <h1 className="kiosk-heading">Welcome to PTC Smart Kiosk</h1>
        <p className="kiosk-subtext">
          Tap a button below to access campus information and services
        </p>

        <div className="kiosk-buttons">
          <button className="kiosk-btn btn btn-success" {...pressNavigate("/announcements")}>
            Announcements
          </button>
          <button className="kiosk-btn btn btn-success" {...pressNavigate("/academic")}>
            Academic Info
          </button>
          <button className="kiosk-btn btn btn-success" {...pressNavigate("/about")}>
            About PTC
          </button>
        </div>

        <div className="kiosk-feature-row">
          <button className="kiosk-btn btn btn-success" {...pressNavigate("/directory")}>
            Office Directory
          </button>
          <button className="kiosk-btn btn btn-success" {...pressNavigate("/map")}>
            Campus Map
          </button>
        </div>
      </div>

      {/* Social Icons Row - outside the card */}
      <div className="kiosk-social-row">
        <FaFacebook
          className="social-icon"
          onClick={() => setQrValue("https://www.facebook.com/ptc1993")}
          title="Facebook Page"
        />
        <p classname="social-caption"> Click to Scan QR code Official Fb Page </p>
        <FaGlobe
          className="social-icon"
          onClick={() => setQrValue("https://paterostechnologicalcollege.edu.ph/")}
          title="Official Website"
        />
        <p classname="social-caption"> Click to Scan QR code Official website </p>
      </div>

      {/* QR Code Modal */}
      {qrValue && (
  <div className="qr-modal-overlay" onClick={() => setQrValue(null)}>
    <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
      <div className="qr-close" onClick={() => setQrValue(null)}>×</div>
      <QRCodeCanvas value={qrValue} size={200} />
    </div>
  </div>
)}

    </div>
  );
}
