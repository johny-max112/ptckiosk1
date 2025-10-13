import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AcademicInfo() {
  const navigate = useNavigate();
  const [academicData, setAcademicData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcademicInfo();
    const interval = setInterval(fetchAcademicInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAcademicInfo = async () => {
    try {
      setLoading(true);
  const res = await axios.get("http://192.168.100.61:5000/api/academic");
      setAcademicData(res.data);
    } catch (err) {
      console.error("Error fetching academic info:", err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <div style={backgroundStyle}></div>
        <div style={cardStyle}>
            <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
          <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>Academic Information</h2>
          <p>Loading academic programs...</p>
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
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginBottom: "30px" }}>Academic Programs</h2>
        {academicData.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6c757d" }}>No academic information available</h3>
            <p style={{ color: "#6c757d" }}>Please check back later or contact the administration.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "25px" }}>
            {academicData.map((program) => (
              <div
                key={program.id}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #dee2e6",
                  borderLeft: "5px solid #007bff",
                  padding: "30px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <h3 style={{ 
                  color: "#2c3e50", 
                  marginBottom: "20px",
                  fontSize: "1.8em",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px"
                }}>
                  {program.title}
                </h3>
                <p style={{ 
                  color: "#495057", 
                  lineHeight: "1.8",
                  fontSize: "1.1em",
                  marginBottom: "20px",
                  textAlign: "justify"
                }}>
                  {program.content}
                </p>
                {program.created_at && (
                  <div style={{
                    borderTop: "1px solid #e9ecef",
                    paddingTop: "15px",
                    fontSize: "0.9em",
                    color: "#6c757d",
                    textAlign: "right"
                  }}>
                    <em>Last updated: {new Date(program.created_at).toLocaleDateString()}</em>
                  </div>
                )}
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
            For more information about our programs, please contact the Academic Affairs office.
          </p>
        </div>
      </div>
    </div>
  );
}