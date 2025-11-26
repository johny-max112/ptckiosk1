import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AboutPTC.css";

export default function AboutPTC() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const prevRef = useRef(null);
  
    useEffect(() => {
      mountedRef.current = true;

      const fetchAbout = async (showLoading = false) => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        if (showLoading) {
          setData(null);
        }
        try {
            
            
            const apiBase = process.env.REACT_APP_API_URL || '';
            const res = await axios.get(`${apiBase}/api/about`, { headers: { 'Cache-Control': 'no-cache' } });
          if (!mountedRef.current) return;
          const json = JSON.stringify(res.data || {});
          if (json !== prevRef.current) {
            setData(res.data);
            prevRef.current = json;
          }
        } catch (err) {
          console.error(err);
        } finally {
          inFlightRef.current = false;
        }
      };

      fetchAbout(true);
      const interval = setInterval(() => fetchAbout(false), 30000);
      return () => {
        mountedRef.current = false;
        clearInterval(interval);
      };
    }, []);

  // Removed smart scrolling and auto animation to preserve normal scroll behavior.

  
    if (!data) {
    return (
      <div className="about-page-root">
        <div className="about-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/pateros.png)` }}></div>
        <div className="about-card">
          
          <h2 className="about-title">About PTC</h2>
          {/* Skeleton placeholders for mission / vision / history */}
          <div className="about-skeleton">
            <div className="skeleton-line short w-70" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line w-90" />
            <div className="skeleton-line short w-40 mt-18" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short w-55 mt-18" />
            <div className="skeleton-line" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page-root">
      <div className="about-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/pateros.png)` }}></div>
      <div className="about-card">
        <div className="about-embedded-header">
          <img src="/ptcround.png" alt="PTC Logo" className="about-embedded-logo" />
          <span onClick={() => navigate("/")} className="about-embedded-title">
            Pateros Technological College
          </span>
        </div>
        {/* Split into multiple full-height sections with smart scroll */}
        <div className="about-content" ref={(el) => { /* keep for layout */ }}>
          {[
            { key: 'inner', title: 'About PTC' },
            { key: 'president', title: 'The President' },
            { key: 'former', title: 'Former PTC Administrators' },
            { key: 'missionvision', title: 'Mission & Vision' },
            { key: 'core', title: 'Core Values' },
            { key: 'hymns', title: 'Hymns' }
          ].map((sec, idx) => (
            <section
              key={sec.key}
              className={`about-section about-section-${sec.key}`}
            >
              <div className="about-inner-card">
                <div className="inner-card-header"><h3>{sec.title}</h3></div>
                <div className="inner-card-content">
                  {sec.key === 'inner' && (
                    <>
                      {data.inner_image && <img src={data.inner_image} alt="inner" className="inner-image" />}
                      <h3 className="about-section-title">About PTC</h3>
                      <p className="about-text">{data.history}</p>
                    </>
                  )}

                  {sec.key === 'president' && (
                    <>
                      <div className="president-row">
                        {data.president_image && <img src={data.president_image} alt="president" className="president-photo" />}
                        <div className="president-details">
                          <div className="president-badge">{data.president_title || 'The President'}</div>
                          <h3 className="president-name">{data.president_name}</h3>
                        </div>
                      </div>
                    </>
                  )}

                  {sec.key === 'former' && (
                    <>
                      <div className="former-grid">
                        {(data.former_admins || []).map((f, i) => (
                          <div key={i} className="former-card">
                            {f.image && <img src={f.image} alt={f.name} className="former-image" />}
                            <div className="former-meta">
                              <div className="former-name">{f.name}</div>
                              <div className="former-position">{f.position}</div>
                              <div className="former-year">{f.year}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {sec.key === 'missionvision' && (
                    <>
                      <div className="mv-row">
                        <div className="mv-box">
                          {data.mission_image && <img src={data.mission_image} alt="mission" className="mv-image" />}
                          <h4 className="mv-heading">Mission</h4>
                          <p className="about-text">{data.mission}</p>
                        </div>
                        <div className="mv-box">
                          {data.vision_image && <img src={data.vision_image} alt="vision" className="mv-image" />}
                          <h4 className="mv-heading">Vision</h4>
                          <p className="about-text">{data.vision}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {sec.key === 'core' && (
                    <>
                      <div className="core-box">
                        <h4>Core Values</h4>
                        <p className="about-text">{data.core_values}</p>
                      </div>
                    </>
                  )}

                  {sec.key === 'hymns' && (
                    <>
                      <div className="hymn-row">
                        <div className="hymn-box">
                          <h4>Hymno ng Pateros </h4>
                          <p className="about-text">{data.hymn_left}</p>
                        </div>
                        <div className="hymn-box">
                          <h4>PTC Hymn </h4>
                          <p className="about-text">{data.hymn_right}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
