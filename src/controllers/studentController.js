const prisma = require('../config/db');

// GET /student/dashboard
const getDashboard = async (req, res) => {
  try {
    const myFeedbacks = await prisma.classroomFeedback.findMany({
      where: { userId: req.session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    const myDisasters = await prisma.disasterSurvey.findMany({
      where: { userId: req.session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.render('student/dashboard', {
      title: 'Student Dashboard', myFeedbacks, myDisasters
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard.');
    res.redirect('/login');
  }
};

// GET /student/profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.session.user.id } });
    res.render('student/profile', { title: 'My Profile', profileUser: user });
  } catch (err) {
    console.error(err);
    res.redirect('/student/dashboard');
  }
};

module.exports = { getDashboard, getProfile };
