import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Kiosk pages
import KioskHome from "./pages/KioskHome";
import Announcements from "./pages/Announcements";
import AcademicInfo from "./pages/AcademicInfo";
import AboutPTC from "./pages/AboutPTC";
import OfficeDirectory from "./pages/OfficeDirectory";
import CampusMap from "./pages/CampusMap";

// Admin pages
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageAnnouncements from "./components/Admin/ManageAnnouncements";
import AdminAbout from "./components/Admin/AdminAbout";
import AdminAcademicInfo from "./components/Admin/AdminAcademicInfo"; 
import AdminOffices from "./components/Admin/AdminOffices"; 
import AdminMaps from "./components/Admin/AdminMaps";

function App() {
  return (
    <Router>
      <Routes>
        {/* Kiosk UI */}
        <Route path="/" element={<KioskHome />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/academic" element={<AcademicInfo />} />
        <Route path="/about" element={<AboutPTC />} />
        <Route path="/directory" element={<OfficeDirectory />} />
        <Route path="/map" element={<CampusMap />} />

        {/* Admin UI */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/announcements" element={<ManageAnnouncements />} />
        <Route path="/admin/about" element={<AdminAbout />} />
        <Route path="/admin/academic-info" element={<AdminAcademicInfo />} />
        <Route path="/admin/offices" element={<AdminOffices />} />
        <Route path="/admin/maps" element={<AdminMaps />} />
      </Routes>
    </Router>
  );
}

export default App;
