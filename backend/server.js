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