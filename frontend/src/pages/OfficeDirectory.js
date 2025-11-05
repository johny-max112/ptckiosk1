import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

export default function OfficeDirectory() {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const prevRef = useRef(null);
  useEffect(() => {
    mountedRef.current = true;

    const fetchOffices = async (showLoading = false) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (showLoading) setLoading(true);
      try {
        // use the api helper so we don't hardcode local IPs here
        const res = await axios.get(api('/api/offices'), { headers: { 'Cache-Control': 'no-cache' } });
        if (!mountedRef.current) return;
        const json = JSON.stringify(res.data || []);
        if (json !== prevRef.current) {
          setOffices(res.data);
          prevRef.current = json;
        }
      } catch (err) {
        console.error("Error fetching offices:", err);
        if (mountedRef.current) setError(err.message || 'Failed to load office data');
      } finally {
        inFlightRef.current = false;
        if (showLoading && mountedRef.current) setLoading(false);
      }
    };

    fetchOffices(true);
    const interval = setInterval(() => fetchOffices(false), 30000);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // Group offices by campus
  const officesByCampus = offices.reduce((acc, office) => {
    let campusName;
    if (office.campus_name) {
      campusName = office.campus_name;
    } else {
      campusName = `Campus ${office.campus_id} (Name Missing)`;
    }
    if (!acc[campusName]) {
      acc[campusName] = [];
    }
    acc[campusName].push(office);
    return acc;
  }, {});

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
          <button
            onClick={() => navigate("/")}
            style={{
              position: "absolute",
              left: 0,
              top: "40px",
              background: "none",
              border: "none",
              color: "#2e7d32",
              fontWeight: "bold",
              fontSize: "1.5em",
              margin: "0 0 0 20px",
              cursor: "pointer",
              textAlign: "left",
              zIndex: 10
            }}
          >
            Pateros Technological College
          </button>
          <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
          <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>Office Directory</h2>
          <p>Loading office information...</p>
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
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginBottom: "30px" }}>Office Directory</h2>
        {error ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#fff3f3",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            border: "1px solid #ffbcbc"
          }}>
            <h3 style={{ color: "#a71d2a" }}>Unable to load office information</h3>
            <p style={{ color: "#6c757d" }}>{error}</p>
            <p style={{ color: "#6c757d" }}>If you're running this locally, ensure the API server is reachable and the app's API base URL is configured (see <code>REACT_APP_API_URL</code>).</p>
          </div>
        ) : offices.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6c757d" }}>No office information available</h3>
            <p style={{ color: "#6c757d" }}>Please check back later or reach out to the administration.</p>
          </div>
        ) : (
          <div>
            {Object.entries(officesByCampus).map(([campusName, campusOffices]) => (
              <div key={campusName} style={{ marginBottom: "40px" }}>
                <h3 style={{ 
                  color: "#2c3e50", 
                  borderBottom: "3px solid #007bff",
                  paddingBottom: "10px",
                  marginBottom: "25px",
                  fontSize: "1.8em"
                }}>
                   {campusName}
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                  gap: "20px" 
                }}>
                  {campusOffices.map((office) => (
                    <div key={office.id} style={{ 
                      padding: "25px", 
                      border: "1px solid #dee2e6", 
                      borderRadius: "10px",
                      backgroundColor: "white",
                      borderLeft: "5px solid #007bff",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <h4 style={{ 
                        color: "#2c3e50", 
                        marginBottom: "15px",
                        fontSize: "1.3em",
                        borderBottom: "1px solid #e9ecef",
                        paddingBottom: "8px"
                      }}>
                        {office.name}
                      </h4>
                      {office.description && (
                        <p style={{ 
                          color: "#495057", 
                          marginBottom: "15px",
                          lineHeight: "1.5",
                          fontStyle: "italic"
                        }}>
                          {office.description}
                        </p>
                      )}
                      <div style={{ 
                        display: "grid", 
                        gap: "10px"
                      }}>
                        {office.contact && (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ 
                              fontWeight: "bold", 
                              color: "#007bff",
                              minWidth: "80px",
                              fontSize: "0.9em"
                            }}>
                               Rooms:
                            </span>
                            <span style={{ color: "#495057", marginLeft: "10px" }}>
                              {office.contact}
                            </span>
                          </div>
                        )}
                        {office.office_hours && (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ 
                              fontWeight: "bold", 
                              color: "#007bff",
                              minWidth: "80px",
                              fontSize: "0.9em"
                            }}>
                               Hours:
                            </span>
                            <span style={{ color: "#495057", marginLeft: "10px" }}>
                              {office.office_hours}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
            For additional assistance, please visit any of the offices listed above during their operating hours.
          </p>
        </div>
      </div>
    </div>
  );
}