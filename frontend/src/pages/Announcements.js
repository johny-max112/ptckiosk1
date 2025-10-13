import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://192.168.100.61:5000/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isCurrentAnnouncement = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return today >= start && today <= end;
  };

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
    background: "rgba(255, 255, 255, 0.95)",
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

        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginBottom: "30px" }}>
          Campus Announcements
        </h2>

        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6c757d" }}>No announcements available</h3>
            <p style={{ color: "#6c757d" }}>Check back later for updates!</p>
          </div>
        ) : (
          <div>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  backgroundColor: "white",
                  border: isCurrentAnnouncement(ann.start_date, ann.end_date) 
                    ? "3px solid #28a745" 
                    : "1px solid #dee2e6",
                  padding: "25px",
                  marginBottom: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  position: "relative"
                }}
              >
                {isCurrentAnnouncement(ann.start_date, ann.end_date) && (
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "15px",
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8em",
                    fontWeight: "bold"
                  }}>
                    CURRENT
                  </div>
                )}
                <h3 style={{ 
                  color: "#2c3e50", 
                  marginBottom: "15px",
                  fontSize: "1.5em"
                }}>
                  {ann.title}
                </h3>
                <p style={{ 
                  color: "#495057", 
                  lineHeight: "1.6",
                  fontSize: "1.1em",
                  marginBottom: "20px"
                }}>
                  {ann.content}
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #e9ecef",
                  paddingTop: "15px",
                  fontSize: "0.9em",
                  color: "#6c757d"
                }}>
                  <span>
                    <strong>Start:</strong> {formatDate(ann.start_date)}
                  </span>
                  <span>
                    <strong>End:</strong> {formatDate(ann.end_date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          textAlign: "center",
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <p style={{ color: "#6c757d", margin: "0" }}>
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
