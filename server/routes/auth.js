const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_key_123';

// Signup and Register Shared Handler
const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(`Signup attempt for: ${email}`);

  if (!name || !email || !password) {
    console.log(`Signup failed: Missing fields for ${email}`);
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, existingUser) => {
    if (err) {
      console.error(`Database error during signup for ${email}:`, err);
      return res.status(500).json({ error: 'Database verification error.' });
    }

    if (existingUser) {
      console.log(`Signup failed: Email already exists - ${email}`);
      return res.status(400).json({ error: 'Email already exists.' });
    } else {
      // Create new user profile as verified
      db.run(
        `INSERT INTO users (id, name, email, password, isVerified) VALUES (?, ?, ?, ?, 1)`,
        [userId, name, email, hashedPassword],
        async (insertErr) => {
          if (insertErr) {
            console.error(`Database error during insertion for ${email}:`, insertErr);
            return res.status(500).json({ error: 'Database insert error.' });
          }
          console.log(`Signup successful for: ${email}`);
          res.status(201).json({ message: 'User created successfully.', email });
        }
      );
    }
  });
};

router.post('/signup', handleSignup);
router.post('/register', handleSignup);

// Login Handler
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);

  if (!email || !password) {
    console.log(`Login failed: Missing fields for ${email}`);
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.error(`Database error during login for ${email}:`, err);
      return res.status(500).json({ error: 'Database verification error.' });
    }
    if (!user) {
      console.log(`Login failed: User not found - ${email}`);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for ${email}`);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`Login successful for: ${email}`);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
      }
    });
  });
});

// Get Current User (Profile)
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.get(`SELECT id, name, email FROM users WHERE id = ?`, [decoded.id], (err, user) => {
      if (!user) return res.status(404).json({ error: 'User not found.' });
      res.json({
        ...user,
        initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
      });
    });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
