import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/announcements")
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📢 Announcements</h2>
      {announcements.length === 0 ? (
        <p>No active announcements.</p>
      ) : (
        <ul>
          {announcements.map((a) => (
            <li key={a.id}>
              <h4>{a.title}</h4>
              <p>{a.content}</p>
              <small>
                {a.start_date} → {a.end_date}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminAnnouncements;
