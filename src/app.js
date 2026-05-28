require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const surveyRoutes = require('./routes/survey');
const prisma = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Flash messages
app.use(flash());

// Global locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    // User IS logged in -> Redirect them to their dashboard based on their role
    const role = req.session.user.role; // Assuming your user object has a 'role' property
    
    if (role === 'admin') return res.redirect('/admin');
    if (role === 'teacher') return res.redirect('/teacher');
    if (role === 'student') return res.redirect('/student');
    
    // Fallback dashboard if role setup is different
    return res.redirect('/surveys');
  }

  const teamMembers = [
    { name: "Kyle Barco", role: "Backend Developer (Lead)", imgUrl: 'https://avatars.githubusercontent.com/u/101305133?v=4' },
    { name: "Muzza Lacamento", role: "Frontend Developer", imgUrl: 'img/muzza.jpg' },
    { name: "Glynicel Vicente", role: "Database Administrator", imgUrl: 'img/glynicel.jpg'},
    { name: "Micah Guda", role: "UI/UX Designer & QA", imgUrl: 'img/micah.jpg'  },
    { name: "Dave Llaguno", role: "Content & Documentation Specialist", imgUrl: 'img/dave.jpg' }
];

  // User IS NOT logged in -> Render the hero page
  // 'hero/hero' points to views/hero/hero.ejs based on your folder structure
  res.render('hero/hero', { title: 'Welcome to SurveyApp', team: teamMembers });
});

// Routes
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);
app.use('/surveys', surveyRoutes);
app.use('/surveys/custom', require('./routes/customSurvey'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
