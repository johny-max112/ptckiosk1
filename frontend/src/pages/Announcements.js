import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Announcements() {
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
      const res = await axios.get("http://localhost:5000/api/announcements");
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

  //  Updated background style with texture
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

  if (loading) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <div style={backgroundStyle}></div>
        <div style={cardStyle}>
          <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
          <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>Campus Announcements</h2>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>Campus Announcements</h2>
        {announcements.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "6c757d" }}>No announcements available</h3>
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
