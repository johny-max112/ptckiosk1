
Basahin mo muna Readme Chat me pag may problem
# PTC Smart Kiosk

## Project Overview
A campus information kiosk built with Node.js (Express) and React, using MySQL for data storage.

## Requirements
- Node.js (v18+ recommended)
- MySQL (XAMPP or standalone)
- npm (Node Package Manager)

## MySQL Setup (XAMPP)
1. Start XAMPP and run MySQL.
2. Open phpMyAdmin at [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Create a database named `ptc_kiosk3`.
4. Import the provided SQL file:
   - Go to the `ptc_kiosk3` database in phpMyAdmin.
   - Click `Import` and select `xampp_database_setup.sql`.
   - Run the import.

## Backend Setup
1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your `.env` file (see `.env.example`).
4. Start the backend server:
   ```sh
   node server.js
   ```

## Frontend Setup
1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

## Step-by-Step Usage
1. Make sure MySQL is running and the database is set up.
2. Start the backend server (`node server.js`).
3. Start the frontend React app (`npm start`).
4. Access the kiosk at [http://localhost:3000](http://localhost:3000).

## Troubleshooteringss
- If you get a MySQL connection error, check that XAMPP MySQL is running and your `.env` settings match your database.
- For missing tables/data, re-import the SQL file in phpMyAdmin.


