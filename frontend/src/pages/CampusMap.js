import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function CampusMap() {
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchMaps = () => {
      axios.get("http://localhost:5000/api/maps")
        .then((res) => setMaps(res.data))
        .catch((err) => console.error(err));
    };
    fetchMaps();
    const interval = setInterval(fetchMaps, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Styles
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

  const mapCardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #dee2e6",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    textAlign: "left"
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    textAlign: "center",
    overflow: "hidden"
  };

  const imageContainerStyle = {
    width: "90vw",
    height: "80vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default"
  };

  const fullscreenImageStyle = {
    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
    transition: isDragging ? "none" : "transform 0.3s ease",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
    maxWidth: "100%",
    maxHeight: "100%",
    userSelect: "none",
    pointerEvents: "none"
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "#ffc107",
    color: "#000",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1em",
    zIndex: 10000
  };

  const zoomControlsStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    gap: "10px",
    zIndex: 10000
  };

  const zoomButtonStyle = {
    backgroundColor: "#ffffff",
    color: "#2c3e50",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <div style={backgroundStyle}></div>
      <div style={cardStyle}>
        <img src="/ptcround.png" alt="PTC Logo" style={logoStyle} />
        <h2 style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "2.1em", marginTop: "60px" }}>
          Campus Maps
        </h2>

        {maps.length === 0 ? (
          <p>No maps available</p>
        ) : (
          maps.map((map) => (
            <div key={map.id} style={mapCardStyle}>
              <h3 style={{ color: "#388e3c", marginBottom: "6px" }}>
                {map.campus_name || `Campus ${map.campus_id}`}
              </h3>
              {map.address && (
                <p style={{ color: "#6c757d", fontSize: "0.95em", marginBottom: "12px" }}>
                  {map.address}
                </p>
              )}
              {map.image_path && (
                <img
                  src={`http://localhost:5000${map.image_path}`}
                  alt={map.description}
                  onClick={() => {
                    setSelectedMap(map);
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(44,62,80,0.12)",
                    marginBottom: "12px",
                    cursor: "pointer"
                  }}
                />
              )}
              <p style={{ color: "#495057", lineHeight: "1.6" }}>{map.description}</p>
            </div>
          ))
        )}
      </div>

      {selectedMap && (
        <div
          style={overlayStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <button onClick={() => setSelectedMap(null)} style={closeButtonStyle}>← Back</button>

          <div style={zoomControlsStyle}>
            <button onClick={() => setScale(prev => Math.min(prev + 0.2, 2))} style={zoomButtonStyle}>Zoom In</button>
            <button onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))} style={zoomButtonStyle}>Zoom Out</button>
            <button onClick={resetZoom} style={zoomButtonStyle}>Reset</button>
          </div>

          <div style={imageContainerStyle}>
            <img
              src={`http://localhost:5000${selectedMap.image_path}`}
              alt={selectedMap.description}
              style={fullscreenImageStyle}
              draggable={false}
            />
          </div>

          <p style={{ color: "#fff", marginTop: "12px", fontSize: "1.1em", maxWidth: "90vw" }}>
            {selectedMap.description}
          </p>

          </div>
      )}
    </div>
  );
}