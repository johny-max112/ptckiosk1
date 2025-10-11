import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OfficeDirectory() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffices();
    const interval = setInterval(fetchOffices, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/offices");
      setOffices(res.data);
    } catch (err) {
      console.error("Error fetching offices:", err);
    } finally {
      setLoading(false);
    }
  };

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
  <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>Office Directory</h2>
        {offices.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#6c757d" }}>No office information available</h3>
            <p style={{ color: "#6c757d" }}>Please check back later or contact the administration.</p>
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
                              📞 Contact:
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
                              🕒 Hours:
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