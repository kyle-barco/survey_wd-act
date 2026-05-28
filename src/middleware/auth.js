// Ensure the user is logged in
const isAuthenticated = (req, res, next) => {
// 1. Check if the user is logged in via the session
  if (req.session && req.session.user) {
    
    // 2. THE CRITICAL FIX: Copy the session user to req.user 
    // so your customSurveyController can find it!
    req.user = req.session.user; 
    
    return next();
  }
  
  // 3. If they aren't logged in, send them to login
  res.redirect('/login');
};

// Ensure the user is NOT logged in
const isGuest = (req, res, next) => {
  if (!req.session.user) return next();
  redirectByRole(res, req.session.user.role);
};

// Role guards
const isAdmin = (req, res, next) => {
  if (req.session.user?.role === 'ADMIN') return next();
  req.flash('error', 'Access denied. Admins only.');
  res.redirect('/login');
};

const isTeacher = (req, res, next) => {
  const role = req.session.user?.role;
  if (role === 'TEACHER' || role === 'ADMIN') return next();
  req.flash('error', 'Access denied. Teachers only.');
  res.redirect('/login');
};

const isStudent = (req, res, next) => {
  const role = req.session.user?.role;
  if (role === 'STUDENT' || role === 'ADMIN') return next();
  req.flash('error', 'Access denied. Students only.');
  res.redirect('/login');
};

const redirectByRole = (res, role) => {
  if (role === 'ADMIN') return res.redirect('/admin/dashboard');
  if (role === 'TEACHER') return res.redirect('/teacher/dashboard');
  res.redirect('/student/dashboard');
};

module.exports = { isAuthenticated, isGuest, isAdmin, isTeacher, isStudent, redirectByRole };
