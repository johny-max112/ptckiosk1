// server.js
const express = require("express");
const cors = require("cors");

// Public kiosk routes
const announcementRoutes = require("./routes/announcementRoutes");
const aboutRoutes = require("./routes/about");
const academicRoutes = require("./routes/academic");
const officeRoutes = require("./routes/offices");
const mapRoutes = require("./routes/maps");

// Admin routes
const adminRoutes = require("./routes/admin"); // login
const adminAboutRoutes = require("./routes/admin/adminAboutRoutes");
const adminAcademicRoutes = require("./routes/admin/adminAcademicRoutes");
const adminMapRoutes = require("./routes/admin/adminMapRoutes");
const adminOfficeRoutes = require("./routes/admin/adminOfficeRoutes");
const adminCampusRoutes = require("./routes/admin/adminCampusRoutes");
const adminAnnouncementRoutes = require("./routes/admin/adminAnnouncementRoutes");  

const app = express();

const path = require('path');
const fs = require('fs');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// connected to dun sa uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  try { fs.mkdirSync(uploadsPath); } catch (err) { console.error('Failed to create uploads dir:', err); }
}
app.use("/uploads", express.static("uploads"));


//  Public Kiosk Routes
app.use("/api/announcements", announcementRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/offices", officeRoutes);
app.use("/api/maps", mapRoutes);

//  Admin Routes
app.use("/api/admin", adminRoutes); // login, etc.
app.use("/api/admin/about", adminAboutRoutes);
app.use("/api/admin/academic", adminAcademicRoutes);
app.use("/api/admin/maps", adminMapRoutes);
app.use("/api/admin/offices", adminOfficeRoutes);
app.use("/api/admin/campuses", adminCampusRoutes);
app.use("/api/admin/announcements", adminAnnouncementRoutes);

// Test route
app.get("/", (req, res) => res.send(" PTC Smart Kiosk Backend running!"));


const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  
  app.get(/.*/, (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).end();
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

// Global error handler: log and return minimal info to client
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
});
