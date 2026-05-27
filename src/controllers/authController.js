const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../config/db');
const { redirectByRole } = require('../middleware/auth');

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

module.exports = { getLogin, postLogin, getRegister, postRegister, logout };
