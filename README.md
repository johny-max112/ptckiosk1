# PTC Smart Kiosk System

A comprehensive kiosk system for Palawan Technical College (PTC) featuring both public information display and administrative management capabilities.

## Project Structure

```
ptckiosk2/
├── backend/           # Node.js/Express API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Authentication middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── tools/         # Utility scripts
├── frontend/          # React.js user interface
│   ├── public/        # Static assets
│   └── src/           # React components and pages
└── README.md
```

## Features

### Public Kiosk Interface
- **Announcements**: View campus announcements and news
- **Academic Information**: Access academic programs and schedules
- **About PTC**: Learn about the college's mission, vision, and history
- **Office Directory**: Find contact information for campus offices
- **Campus Map**: Navigate the campus with interactive maps

### Administrative Panel
- **Secure Login**: JWT-based authentication system
- **Content Management**: Update announcements, academic info, and about page
- **Office Management**: Add, edit, and remove office directory entries
- **Map Management**: Upload and manage campus maps
- **User Management**: Admin account creation and management

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://gitlab.com/johnydevy/ptckiosk2.git
cd ptckiosk2
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ptc_kiosk1

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Configuration (for initial setup only)
ADMIN_NAME=Your Admin Name
ADMIN_EMAIL=admin@ptc.edu.ph
ADMIN_PASSWORD=your_secure_admin_password_here
```

#### Database Setup
1. Create a MySQL database named `ptc_kiosk1`
2. Import the database schema (create tables for: admins, announcements, academic, about, offices, maps, campuses)

#### Create Admin Account
```bash
npm run create-admin
```

#### Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file:
```env
# Environment Configuration for Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

#### Start the Frontend Development Server
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Public Endpoints
- `GET /api/announcements` - Get all announcements
- `GET /api/academic` - Get academic information
- `GET /api/about` - Get about page content
- `GET /api/offices` - Get office directory
- `GET /api/maps` - Get campus maps

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin authentication
- `PUT /api/admin/about` - Update about page content
- `GET|POST|PUT|DELETE /api/admin/announcements` - Manage announcements
- `GET|POST|PUT|DELETE /api/admin/academic` - Manage academic info
- `GET|POST|PUT|DELETE /api/admin/offices` - Manage office directory
- `GET|POST|PUT|DELETE /api/admin/maps` - Manage campus maps

## Security Features

- **JWT Authentication**: Secure token-based authentication for admin access
- **Environment Variables**: All sensitive data stored in environment variables
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Cross-origin request protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet Security**: Additional security headers

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Starts React development server
```

### Creating New Admin Users
```bash
cd backend
npm run create-admin
```

## Production Deployment

### Environment Variables
Ensure all environment variables are properly set in production:
- Use strong, unique JWT secrets
- Use secure database credentials
- Set NODE_ENV=production
- Configure proper CORS origins

### Database
- Use a production MySQL database
- Ensure proper database user permissions
- Regular backups recommended

### Security Considerations
- Change default admin credentials immediately
- Use HTTPS in production
- Implement proper firewall rules
- Regular security updates

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials in .env file
   - Ensure database exists

2. **JWT Token Issues**
   - Verify JWT_SECRET is set in .env
   - Check token expiration (default: 8 hours)

3. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check API_URL in frontend .env

4. **Admin Login Issues**
   - Run `npm run create-admin` to create admin account
   - Check admin credentials in database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.