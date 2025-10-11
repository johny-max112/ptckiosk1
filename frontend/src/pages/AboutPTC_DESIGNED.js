import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AboutPTC() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/about");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching about data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e9ecef",
            borderTop: "4px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p style={{ color: "#6c757d", fontSize: "1.1em" }}>Loading About PTC...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa"
      }}>
        <div style={{
          textAlign: "center",
          padding: "60px 40px",
          backgroundColor: "white",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "500px"
        }}>
          <h3 style={{ color: "#6c757d", marginBottom: "15px" }}>Information Not Available</h3>
          <p style={{ color: "#6c757d" }}>About PTC information is currently being updated. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "40px 20px"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "50px"
      }}>
        <h1 style={{
          fontSize: "3.5em",
          fontWeight: "300",
          color: "#2c3e50",
          margin: "0",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}>
          🏫 About PTC
        </h1>
        <div style={{
          width: "100px",
          height: "4px",
          backgroundColor: "#007bff",
          margin: "20px auto",
          borderRadius: "2px"
        }}></div>
        <p style={{
          fontSize: "1.2em",
          color: "#6c757d",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.6"
        }}>
          Learn about our institution's mission, vision, and rich history
        </p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Mission Section */}
        {data.mission && (
          <div style={{
            marginBottom: "40px",
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "40px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e9ecef",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "5px",
              background: "linear-gradient(90deg, #007bff, #0056b3)"
            }}></div>
            
            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#007bff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
                fontSize: "1.8em"
              }}>
                🎯
              </div>
              <h2 style={{
                color: "#2c3e50",
                margin: "0",
                fontSize: "2.2em",
                fontWeight: "400"
              }}>
                Our Mission
              </h2>
            </div>
            
            <p style={{
              fontSize: "1.3em",
              lineHeight: "1.8",
              color: "#495057",
              margin: "0",
              textAlign: "justify",
              fontWeight: "300"
            }}>
              {data.mission}
            </p>
          </div>
        )}

        {/* Vision Section */}
        {data.vision && (
          <div style={{
            marginBottom: "40px",
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "40px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e9ecef",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "5px",
              background: "linear-gradient(90deg, #28a745, #20c997)"
            }}></div>
            
            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#28a745",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
                fontSize: "1.8em"
              }}>
                🔮
              </div>
              <h2 style={{
                color: "#2c3e50",
                margin: "0",
                fontSize: "2.2em",
                fontWeight: "400"
              }}>
                Our Vision
              </h2>
            </div>
            
            <p style={{
              fontSize: "1.3em",
              lineHeight: "1.8",
              color: "#495057",
              margin: "0",
              textAlign: "justify",
              fontWeight: "300"
            }}>
              {data.vision}
            </p>
          </div>
        )}

        {/* History Section */}
        {data.history && (
          <div style={{
            marginBottom: "40px",
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "40px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e9ecef",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "5px",
              background: "linear-gradient(90deg, #ffc107, #fd7e14)"
            }}></div>
            
            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#ffc107",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
                fontSize: "1.8em"
              }}>
                📚
              </div>
              <h2 style={{
                color: "#2c3e50",
                margin: "0",
                fontSize: "2.2em",
                fontWeight: "400"
              }}>
                Our History
              </h2>
            </div>
            
            <div style={{
              fontSize: "1.3em",
              lineHeight: "1.8",
              color: "#495057",
              textAlign: "justify",
              fontWeight: "300",
              whiteSpace: "pre-wrap"
            }}>
              {data.history}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "60px",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ 
            color: "#2c3e50", 
            marginBottom: "15px",
            fontSize: "1.5em"
          }}>
            🌟 Excellence in Technical Education
          </h3>
          <p style={{ 
            color: "#6c757d", 
            margin: "0",
            fontSize: "1.1em",
            lineHeight: "1.6"
          }}>
            Committed to providing quality education and shaping future leaders in technology and innovation.
          </p>
          {data.last_updated && (
            <p style={{
              marginTop: "20px",
              fontSize: "0.9em",
              color: "#adb5bd",
              fontStyle: "italic"
            }}>
              Last updated: {new Date(data.last_updated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}