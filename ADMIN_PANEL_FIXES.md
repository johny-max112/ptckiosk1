# Admin Panel Fixes - PTC Smart Kiosk

## Issues Fixed

### 1. Database Configuration
- **Problem**: Mixed `mysql2/promise` with callback-style queries
- **Fix**: Updated `backend/config/db.js` to use standard `mysql2` with callbacks
- **New File**: `backend/config/db_fixed.js` (use this instead)

### 2. Missing Admin Announcement Routes
- **Problem**: No admin routes for managing announcements with authentication
- **Fix**: Created `backend/routes/admin/adminAnnouncementRoutes.js`
- **Added**: Full CRUD operations with JWT authentication

### 3. Authentication Issues
- **Problem**: JWT_SECRET hardcoded and inconsistent across files
- **Fix**: Updated both `backend/routes/admin.js` and `backend/middleware/auth.js` to use environment variable with fallback

### 4. Frontend API Integration
- **Problem**: Frontend calling wrong endpoints without authentication
- **Fix**: Updated `ManageAnnouncements.js` with:
  - Proper admin API endpoints (`/api/admin/announcements`)
  - JWT token authentication headers
  - Better error handling and user feedback
  - Improved UI with loading states

### 5. Server Route Registration
- **Problem**: Admin announcement routes not registered in server
- **Fix**: Added admin announcement routes to `backend/server.js`

## Setup Instructions

### 1. Database Setup
```sql
-- Run the SQL script to create tables
mysql -u root -p your_database < backend/setup_database.sql
```

### 2. Create Admin User
```bash
cd backend
node create_admin.js
```
This creates an admin user:
- **Email**: admin@ptc.edu  
- **Password**: admin123

### 3. Environment Variables
Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ptc_kiosk1
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Install Dependencies
```bash
# Backend
cd backend
npm install bcrypt jsonwebtoken mysql2 express cors dotenv

# Frontend  
cd frontend
npm install axios
```

### 5. Start the Application
```bash
# Backend (Terminal 1)
cd backend
node server.js

# Frontend (Terminal 2)  
cd frontend
npm start
```

## Testing the Admin Panel

1. **Login**: Go to `http://localhost:3000/admin`
   - Email: admin@ptc.edu
   - Password: admin123

2. **Dashboard**: After login, you'll be redirected to `/admin/dashboard`

3. **Manage Announcements**: Click "📢 Manage Announcements"
   - Add new announcements with title, content, start/end dates
   - Edit existing announcements
   - Delete announcements
   - Toggle active/inactive status

## Key Features Now Working

✅ **Admin Authentication**: JWT-based login system  
✅ **Announcement Management**: Full CRUD operations  
✅ **Protected Routes**: All admin routes require authentication  
✅ **Error Handling**: Proper error messages and session management  
✅ **Responsive UI**: Better form layout and user feedback  
✅ **Date Handling**: Proper date formatting for forms  

## Files Modified/Created

### Backend
- `backend/routes/admin/adminAnnouncementRoutes.js` (NEW)
- `backend/config/db_fixed.js` (NEW)  
- `backend/create_admin.js` (NEW)
- `backend/setup_database.sql` (NEW)
- `backend/server.js` (MODIFIED)
- `backend/routes/admin.js` (MODIFIED)
- `backend/middleware/auth.js` (MODIFIED)

### Frontend
- `frontend/src/components/Admin/ManageAnnouncements.js` (REPLACED)

## Next Steps

1. **Replace database config**: Use `db_fixed.js` instead of the current `db.js`
2. **Set up environment variables**: Create `.env` file with proper values
3. **Run database setup**: Execute the SQL script to create tables
4. **Create admin user**: Run the admin creation script
5. **Test the system**: Login and test all admin features

## Security Notes

- Change the default admin password after first login
- Use a strong JWT_SECRET in production
- Consider adding password reset functionality
- Add input validation and sanitization
- Implement rate limiting for login attempts