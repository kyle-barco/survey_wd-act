const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../config/db');
const { redirectByRole } = require('../middleware/auth');
const crypto = require('crypto');

// Initialize Resend with your API key from .env
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// GET /login
const getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// POST /login
const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect('/login');
  }

  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    req.flash('success', `Welcome back, ${user.name}!`);
    redirectByRole(res, user.role);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
};

// GET /register
const getRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

// POST /register
const postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect('/register');
  }

  const { name, email, password, role, phone, address } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role || 'STUDENT',
        phone: phone || null,
        address: address || null,
      }
    });
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    req.flash('success', 'Registration successful!');
    redirectByRole(res, user.role);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
};

// POST /logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

// ==========================================
// NEW: Forgot Password Methods
// ==========================================

// GET /forgot-password
const getForgotPassword = (req, res) => {
  res.render('password/forgot-password', { title: 'Forgot Password' });
};

// POST /forgot-password
const postForgotPassword = async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect(req.originalUrl); 
  }

  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Safety check: if user doesn't exist, redirect gracefully
    if (!user) {
      req.flash('success', 'If that email exists, a reset link has been sent.');
      return res.redirect('/forgot-password');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiration

    // Save token to your PostgreSQL user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiryDate
      }
    });

    const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
    
    // 👇 THIS LOGS IT DIRECTLY TO YOUR VS CODE TERMINAL FOR EASY TESTING
    console.log('\n=============================================');
    console.log('🚀 ECHO PASSWORD RESET LINK GENERATED:');
    console.log(resetUrl);
    console.log('=============================================\n');

    try {
      // Send the email using Resend
      const { data, error } = await resend.emails.send({
        from: 'ECHO App <onboarding@resend.dev>', // MUST be this exact address on the free tier
        to: user.email, 
        subject: 'ECHO - Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h3>Password Reset Request</h3>
            <p>You requested a password reset for your account.</p>
            <p>Please click the button below to securely update your password:</p>
            <a href="${resetUrl}" style="padding: 10px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
            <br><br>
            <p style="color: #666; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
          </div>
        `
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        req.flash('success', '[DEV MODE] Resend failed. Check terminal for the link.');
        return res.redirect('/login');
      }

      req.flash('success', 'A dynamic password reset link has been sent to your email.');
      res.redirect('/login');

    } catch (emailErr) {
      // If email configuration fails, don't crash! 
      // Inform the developer and let them use the terminal link instead.
      console.error('❌ Server Error while calling Resend:', emailErr.message);
      req.flash('success', '[DEV MODE] Link printed to your backend server terminal console!');
      res.redirect('/login');
    }

  } catch (err) {
    console.error('❌ Database/Controller Error:', err);
    req.flash('error', 'An error occurred while trying to process your request.');
    res.redirect('/forgot-password');
  }
};

// GET /reset-password/:token
const getResetPassword = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot-password');
    }

    res.render('password/reset-password', { title: 'Reset Password', token: req.params.token });
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/forgot-password');
  }
};

// POST /reset-password/:token
const postResetPassword = async (req, res) => {
  // 2. Check validation results inside the function
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect(req.originalUrl); 
  }

  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot-password');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect(`/reset-password/${token}`);
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    req.flash('success', 'Your password has been successfully updated. You can now log in.');
    res.redirect('/login');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Reset failed. Please try again.');
    res.redirect(`/reset-password/${token}`);
  }
};

module.exports = { 
  getLogin, 
  postLogin, 
  getRegister, 
  postRegister, 
  logout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword
};