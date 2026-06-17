const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../config/db');
const { redirectByRole } = require('../middleware/auth');
const crypto = require('crypto');

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Hash a token before storing/comparing it.
// Only the hash ever touches the database; the raw token only ever
// goes out in the email link, never persisted anywhere.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

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


// GET /forgot-password
const getForgotPassword = (req, res) => {
  res.render('password/forgot-password', { title: 'Forgot Password' });
};

// POST /forgot-password
const postForgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect(req.originalUrl);
  }

  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always show the same message whether or not the email exists,
    // so this endpoint can't be used to enumerate registered emails.
    if (!user) {
      req.flash('success', 'If that email exists, a reset link has been sent.');
      return res.redirect('/forgot-password');
    }

    // Raw token goes in the email link sent to the user.
    const rawToken = crypto.randomBytes(20).toString('hex');
    // Only the hash of the token is stored in the database.
    const hashedToken = hashToken(rawToken);
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiration

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiryDate
      }
    });

    const resetUrl = `http://${req.headers.host}/reset-password/${rawToken}`;

    // Dev-only convenience logging - never expose reset links in prod logs.
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n=============================================');
      console.log('🚀 DEV PASSWORD RESET LINK:');
      console.log(resetUrl);
      console.log('=============================================\n');
    }

    try {
      const { data, error } = await resend.emails.send({
        // Must be a full email address on your verified Resend domain,
        // not just the bare domain.
        from: 'ECHO App <noreply@mail.kylbrc.xyz>',
        to: user.email,
        subject: 'ECHO - Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h3>Password Reset Request</h3>
            <p>You requested a password reset for your account.</p>
            <p>Please click the button below to securely update your password:</p>
            <a href="${resetUrl}" style="padding: 10px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
            <br><br>
            <p style="color: #666; font-size: 12px;">This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
          </div>
        `
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        req.flash('error', process.env.NODE_ENV !== 'production'
          ? '[DEV MODE] Resend failed. Check terminal for the link.'
          : 'Could not send reset email. Please try again later.');
        return res.redirect('/forgot-password');
      }

      req.flash('success', 'If that email exists, a reset link has been sent.');
      res.redirect('/login');

    } catch (emailErr) {
      console.error('❌ Server Error while calling Resend:', emailErr.message);
      req.flash('error', process.env.NODE_ENV !== 'production'
        ? '[DEV MODE] Resend threw an error. Check terminal for the link.'
        : 'Could not send reset email. Please try again later.');
      res.redirect('/forgot-password');
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
    const hashedToken = hashToken(req.params.token);

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect(req.originalUrl);
  }

  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    const hashedToken = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
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