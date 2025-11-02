import React from "react";
import { useNavigate } from "react-router-dom";
import './KioskHome.css';

export default function KioskHome() {
  const navigate = useNavigate();

  const [touched, setTouched] = React.useState(() => {
    return localStorage.getItem("kioskTouched") === "true";
  });

  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every second
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
        {/* Date and Time inside the card */}
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
          {(() => {
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

            return (
              <>
                <button className="kiosk-btn btn btn-success" {...pressNavigate("/announcements")}>
                  Announcements
                </button>
                <button className="kiosk-btn btn btn-success" {...pressNavigate("/academic")}>
                  Academic Info
                </button>
                <button className="kiosk-btn btn btn-success" {...pressNavigate("/about")}>
                  About PTC
                </button>
                <button className="kiosk-btn btn btn-success" {...pressNavigate("/directory")}>
                  Office Directory
                </button>
                <button className="kiosk-btn btn btn-success" {...pressNavigate("/map")}>
                  Campus Map
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}