const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_key_123';

// Initialize Nodemailer Transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Premium HTML SaaS Email Disptacher
const sendOTPEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('SMTP credentials are not configured in the environment (.env file).');
  }

  const mailOptions = {
    from: `"IncidentIQ Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'IncidentIQ Security Verification',
    html: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030303; color: #ffffff; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #06b6d4); padding: 12px; border-radius: 12px; margin-bottom: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h2 style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin-top: 15px; margin-bottom: 5px; background: linear-gradient(to right, #6366f1, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">IncidentIQ</h2>
          <span style="color: #4b5563; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">A.I. Telemetry Core</span>
        </div>
        
        <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; text-align: center; color: #f3f4f6;">Authorize Workstation Access</h3>
        
        <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
          A login or profile deployment was initiated for your workstation. Enter the secure 6-digit authentication token below to verify your identity.
        </p>
        
        <div style="background-color: #0c0c0e; border: 1px solid #27272a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
          <span style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #6366f1; font-family: monospace;">${otp}</span>
        </div>
        
        <p style="color: #f87171; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-align: center; margin-bottom: 25px;">
          ⚠️ This authorization code will expire in 5 minutes.
        </p>
        
        <div style="border-top: 1px solid #1a1a1a; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
            If you did not request this token, please ignore this email or review your security configuration.
          </p>
          <p style="color: #4b5563; font-size: 10px; margin-top: 20px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">
            IncidentIQ Telemetry Core • SaaS Fleet Workstation
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Signup and Register Shared Handler
const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
  const userId = uuidv4();

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, existingUser) => {
    if (err) return res.status(500).json({ error: 'Database verification error.' });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: 'Email already exists and is verified.' });
      }
      
      // Cooldown check for existing unverified user (30s)
      if (existingUser.lastResend && Date.now() - existingUser.lastResend < 30 * 1000) {
        const remaining = Math.ceil((30 * 1000 - (Date.now() - existingUser.lastResend)) / 1000);
        return res.status(429).json({ error: `Please wait ${remaining} seconds before requesting a new code.` });
      }

      // Update unverified user, reset code and attempts
      db.run(
        `UPDATE users SET name = ?, password = ?, otp = ?, otpExpiry = ?, otpAttempts = 0, lastResend = ? WHERE id = ?`,
        [name, hashedPassword, hashedOtp, otpExpiry, Date.now(), existingUser.id],
        async (updateErr) => {
          if (updateErr) return res.status(500).json({ error: 'Failed to update user profile.' });
          
          try {
            await sendOTPEmail(email, otp);
            res.json({ message: 'User profile updated. Verification email dispatched.', email });
          } catch (mailErr) {
            console.error('Mail delivery failure:', mailErr);
            res.status(500).json({ 
              error: 'Failed to deliver verification email. Please verify server SMTP configuration.',
              details: mailErr.message
            });
          }
        }
      );
    } else {
      // Create new user profile
      db.run(
        `INSERT INTO users (id, name, email, password, otp, otpExpiry, otpAttempts, lastResend) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
        [userId, name, email, hashedPassword, hashedOtp, otpExpiry, Date.now()],
        async (insertErr) => {
          if (insertErr) return res.status(500).json({ error: 'Database insert error.' });
          
          try {
            await sendOTPEmail(email, otp);
            res.status(201).json({ message: 'User created. Verification email dispatched.', email });
          } catch (mailErr) {
            console.error('Mail delivery failure:', mailErr);
            res.status(500).json({ 
              error: 'Failed to deliver verification email. Please verify server SMTP configuration.',
              details: mailErr.message
            });
          }
        }
      );
    }
  });
};

router.post('/signup', handleSignup);
router.post('/register', handleSignup);

// Send & Resend OTP Handler
const handleResendOtp = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required.' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database verification error.' });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ error: 'Email already verified.' });

    // Cooldown check (30 seconds)
    if (user.lastResend && Date.now() - user.lastResend < 30 * 1000) {
      const remaining = Math.ceil((30 * 1000 - (Date.now() - user.lastResend)) / 1000);
      return res.status(429).json({ error: `Please wait ${remaining} seconds before requesting another code.` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

    db.run(
      `UPDATE users SET otp = ?, otpExpiry = ?, otpAttempts = 0, lastResend = ? WHERE id = ?`,
      [hashedOtp, otpExpiry, Date.now(), user.id],
      async (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'Failed to generate new authorization token.' });

        try {
          await sendOTPEmail(email, otp);
          res.json({ message: 'A new verification code has been dispatched to your email.' });
        } catch (mailErr) {
          console.error('Mail delivery failure:', mailErr);
          res.status(500).json({ 
            error: 'Failed to deliver email. Please check server SMTP configuration.',
            details: mailErr.message
          });
        }
      }
    );
  });
};

router.post('/resend-otp', handleResendOtp);
router.post('/send-otp', handleResendOtp);

// Verify OTP Handler
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and verification code are required.' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database verification error.' });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Brute-force block check
    if (user.otpAttempts >= 5) {
      return res.status(403).json({ error: 'Account locked due to too many failed attempts. Please request a new verification code.' });
    }

    // Expiry check
    if (!user.otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ error: 'Verification code has expired or is invalid. Please request a new code.' });
    }

    // Secure token comparison using bcrypt
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      const attemptsLeft = 5 - (user.otpAttempts + 1);
      db.run(`UPDATE users SET otpAttempts = otpAttempts + 1 WHERE id = ?`, [user.id], () => {
        if (attemptsLeft <= 0) {
          res.status(403).json({ error: 'Too many incorrect attempts. Your verification code is now locked. Please request a new code.' });
        } else {
          res.status(400).json({ error: `Invalid verification code. You have ${attemptsLeft} attempts remaining.` });
        }
      });
      return;
    }

    // Verify User Status
    db.run(
      `UPDATE users SET isVerified = 1, otp = NULL, otpExpiry = NULL, otpAttempts = 0 WHERE id = ?`,
      [user.id],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'Failed to complete verification process.' });
        res.json({ message: 'Email verified successfully. You can now log in.' });
      }
    );
  });
});

// Login Handler
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database verification error.' });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

    if (!user.isVerified) {
      // Generate a fresh OTP and dispatch immediately
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

      db.run(
        `UPDATE users SET otp = ?, otpExpiry = ?, otpAttempts = 0, lastResend = ? WHERE id = ?`,
        [hashedOtp, otpExpiry, Date.now(), user.id],
        async (updateErr) => {
          try {
            await sendOTPEmail(email, otp);
            return res.status(403).json({ 
              error: 'Email not verified. A fresh verification code has been dispatched to your inbox.', 
              unverified: true 
            });
          } catch (mailErr) {
            console.error('Mail delivery failure during unverified trigger:', mailErr);
            return res.status(403).json({ 
              error: 'Email not verified. Failed to dispatch fresh verification code, please check SMTP settings.', 
              unverified: true 
            });
          }
        }
      );
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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
