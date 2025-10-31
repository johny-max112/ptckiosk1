// Small helper to build API URLs in the frontend.
// If REACT_APP_API_URL is set (e.g. "http://192.168.1.2:5000"), it will be used
// as the base; otherwise we use a relative path so the CRA dev proxy works.
const API_BASE = process.env.REACT_APP_API_URL || "";

export default function api(path) {
  // ensure path starts with '/'
  if (!path) return API_BASE;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}
