// server.js
// Simple Express + SQLite backend for my gym membership assignment.
// The Vue frontend calls this API to save and load member records.

const path = require('path');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Path to the SQLite database file.
// For this small project I just keep it in the backend folder.
const dbPath = path.join(__dirname, 'gymdb.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});
// ---------------------------------------------
// Create members table if it doesn't exist yet

// ---------------------------------------------

const createTableSql = `
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    sex TEXT,
    age INTEGER,
    dob TEXT,
    address TEXT,
    state TEXT,
    country TEXT,
    email TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    membership_type TEXT,
    medications TEXT,
    allergies TEXT,
    past_injuries TEXT,
    medical_conditions TEXT,
    medical_contact TEXT,
    medical_contact_phone TEXT,
    other_info TEXT,
    payment_type TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

db.run(createTableSql, (err) => {
  if (err) {
    console.error('Error creating members table:', err.message);
  } else {
    console.log('Members table is ready.');
  }
});
// Basic middleware used by almost every small REST API.
app.use(cors());         // allow the frontend (different port) to call this API
app.use(express.json()); // parse JSON bodies sent from Axios on the frontend

// Very small health-check route so I can quickly see if the server is up.
app.get('/', (req, res) => {
  res.send('Gym membership API is running');
});

// In the next batch I will add the SQL to create the members table
// and all the CRUD routes.

// Start the HTTP server.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});