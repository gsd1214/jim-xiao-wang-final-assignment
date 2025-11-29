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

// ---------------------------------------------
// Create and Read endpoints for members
// The Vue frontend uses these to save new records and
// load the list of existing members.
// ---------------------------------------------
// Create a new member
app.post('/api/members', (req, res) => {
  const d = req.body;

  const sql = `
    INSERT INTO members
      (name, sex, age, dob, address, state, country, email,
       emergency_contact, emergency_phone, membership_type,
       medications, allergies, past_injuries, medical_conditions,
       medical_contact, medical_contact_phone, other_info, payment_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    d.name,
    d.sex,
    d.age,
    d.dob,
    d.address,
    d.state,
    d.country,
    d.email,
    d.emergency_contact,
    d.emergency_phone,
    d.membership_type,
    d.medications,
    d.allergies,
    d.past_injuries,
    d.medical_conditions,
    d.medical_contact,
    d.medical_contact_phone,
    d.other_info,
    d.payment_type
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Insert error:', err.message);
      return res.status(500).json({ error: 'Database insert failed' });
    }
    // this.lastID is provided by sqlite3 for the new row
    res.json({ success: true, id: this.lastID });
  });
});

// Get all members (for the list view)
app.get('/api/members', (req, res) => {
  const sql = 'SELECT * FROM members ORDER BY id DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Select error:', err.message);
      return res.status(500).json({ error: 'Database select failed' });
    }
    res.json(rows);
  });
});

// ---------------------------------------------
// Update and Delete endpoints for members
// Complete the basic CRUD functions.
// ---------------------------------------------

// Update an existing member by id
app.put('/api/members/:id', (req, res) => {
  const id = req.params.id;
  const d = req.body;

  const sql = `
    UPDATE members
    SET name = ?,
        sex = ?,
        age = ?,
        dob = ?,
        address = ?,
        state = ?,
        country = ?,
        email = ?,
        emergency_contact = ?,
        emergency_phone = ?,
        membership_type = ?,
        medications = ?,
        allergies = ?,
        past_injuries = ?,
        medical_conditions = ?,
        medical_contact = ?,
        medical_contact_phone = ?,
        other_info = ?,
        payment_type = ?
    WHERE id = ?
  `;

  const params = [
    d.name,
    d.sex,
    d.age,
    d.dob,
    d.address,
    d.state,
    d.country,
    d.email,
    d.emergency_contact,
    d.emergency_phone,
    d.membership_type,
    d.medications,
    d.allergies,
    d.past_injuries,
    d.medical_conditions,
    d.medical_contact,
    d.medical_contact_phone,
    d.other_info,
    d.payment_type,
    id
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Update error:', err.message);
      return res.status(500).json({ error: 'Database update failed' });
    }
    res.json({ success: true, changes: this.changes });
  });
});

// Delete a member by id
app.delete('/api/members/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM members WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Delete error:', err.message);
      return res.status(500).json({ error: 'Database delete failed' });
    }
    res.json({ success: true, changes: this.changes });
  });
});
// In the next batch I will add the SQL to create the members table
// and all the CRUD routes.

// Start the HTTP server.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});