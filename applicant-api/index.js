const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000; // Use an environment variable for the port

// Replace with your actual database connection details
const pool = mysql.createPool({
  host: 'Deviare-0004',
  user: 'localhost 3306',
  password: 'Oyama@1997',
  database: 'applicants'
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Create applicant (POST /applicants)
app.post('/applicants', async (req, res) => {
  try {
    const newApplicant = req.body;

    // Validate applicant data using a validation library or custom logic
    // (e.g., ensure required fields are present, email is valid format)

    const [result] = await pool.query('INSERT INTO applicants SET ?', newApplicant);
    const createdApplicantId = result.insertId;

    res.status(201).json({ message: 'Applicant created successfully!', applicantId: createdApplicantId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating applicant' });
  }
});

// Fetch applicant (GET /applicants/:id or /applicants/:email)
app.get('/applicants/:id', async (req, res) => {
  try {
    const applicantId = req.params.id;

    const [result] = await pool.query('SELECT * FROM applicants WHERE id = ?', applicantId);

    if (result.length === 0) {
      res.status(404).json({ message: 'Applicant not found' });
      return;
    }

    const applicant = result[0];
    res.json(applicant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching applicant' });
  }
});

// Update applicant status (PUT /applicants/:id/status)
app.put('/applicants/:id/status', async (req, res) => {
  try {
    const applicantId = req.params.id;
    const newStatus = req.body.status; // Validate status value (Rejected/Hired)

    const [result] = await pool.query('UPDATE applicants SET status = ? WHERE id = ?', [newStatus, applicantId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Applicant not found' }); // Closing curly brace added here
    } else {
      res.json({ message: 'Applicant status updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating applicant status' });
  }
});

// **Additional endpoint for fetching by email (optional):**
// You can uncomment this block if you want to allow fetching by email

// app.get('/applicants/:email', async (req, res) => {
//   try {
//     const applicantEmail = req.params.email;

//     const [result] = await pool.query('SELECT * FROM applicants WHERE email = ?', applicantEmail);

//     if (result.length === 0) {
//       res.status(404).json({ message: 'Applicant not found' });
//       return;
//     }

//     const applicant = result[0];
//     res.json(applicant);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching applicant' });
//   }
// });

app.listen(port, () => {
  console.log(`Server listening on port ${3306}`);
});
