import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Announcements.css";

export default function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const prevRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    const fetchAnnouncements = async (showLoading = false) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (showLoading) setLoading(true);
      try {
        const res = await axios.get("http://192.168.100.61:5000/api/announcements", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!mountedRef.current) return;
        const json = JSON.stringify(res.data || []);
        if (json !== prevRef.current) {
          setAnnouncements(res.data);
          prevRef.current = json;
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        inFlightRef.current = false;
        if (showLoading && mountedRef.current) setLoading(false);
      }
    };

    fetchAnnouncements(true);
    const interval = setInterval(() => fetchAnnouncements(false), 30000);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isCurrentAnnouncement = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return today >= start && today <= end;
  };

  const openAnnouncement = (ann) => {
    setSelectedAnnouncement(ann);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  return (
    <div className="announcements-page">
      <div className="background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/pateros.png)` }}></div>

      <div className="card">
        <div className="embedded-header">
          <img src="/ptcround.png" alt="PTC Logo" className="embedded-logo" />
          <span onClick={() => navigate("/")} className="embedded-title">
            Pateros Technological College
          </span>
        </div>

      

        <div className="inner-cards">
          
          <div className="campus-card">
            <div className="campus-header">
              <h3>Campus Announcement</h3>
            </div>
            
            <div className="campus-content">
              {loading ? (
                <p>Loading announcements...</p>
              ) : announcements.length === 0 ? (
                <div className="no-announcements">
                  <h3>No announcements available</h3>
                  <p>Check back later for updates!</p>
                </div>
              ) : (
                <div>
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openAnnouncement(ann)}
                      onKeyDown={(e) => e.key === "Enter" && openAnnouncement(ann)}
                      className={`announcement-box ${
                        isCurrentAnnouncement(ann.start_date, ann.end_date)
                          ? "current"
                          : ""
                      }`}
                    >
                      {isCurrentAnnouncement(ann.start_date, ann.end_date) && (
                        <div className="current-badge">CURRENT</div>
                      )}
                      <h3>{ann.title}</h3>
                      <p>{ann.content}</p>
                      <div className="dates">
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

            </div>

            {/* Modal for full announcement details */}
            {modalOpen && selectedAnnouncement && (
              <div className="modal-overlay" onClick={closeModal}>
                <div
                  className="modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
                  <h2 id="modal-title">{selectedAnnouncement.title}</h2>
                  <div className="modal-dates">
                    <span>
                      <strong>Start:</strong> {formatDate(selectedAnnouncement.start_date)}
                    </span>
                    <span>
                      <strong>End:</strong> {formatDate(selectedAnnouncement.end_date)}
                    </span>
                  </div>
                  <div className="modal-body">{selectedAnnouncement.content}</div>
                </div>
              </div>
            )}

            {/* Modal for full announcement details (moved inside return) */}
            {modalOpen && selectedAnnouncement && (
              <div className="modal-overlay" onClick={closeModal}>
                <div
                  className="modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
                  <h2 id="modal-title">{selectedAnnouncement.title}</h2>
                  <div className="modal-dates">
                    <span>
                      <strong>Start:</strong> {formatDate(selectedAnnouncement.start_date)}
                    </span>
                    <span>
                      <strong>End:</strong> {formatDate(selectedAnnouncement.end_date)}
                    </span>
                  </div>
                  <div className="modal-body">{selectedAnnouncement.content}</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
