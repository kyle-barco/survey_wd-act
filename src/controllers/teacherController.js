const prisma = require('../config/db');

// GET /teacher/dashboard
const getDashboard = async (req, res) => {
  try {
    const feedbacks = await prisma.classroomFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const avgRating = feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.teacherRating, 0) / feedbacks.length).toFixed(1)
      : 'N/A';
    const bySubject = feedbacks.reduce((acc, f) => {
      acc[f.subject] = (acc[f.subject] || 0) + 1;
      return acc;
    }, {});
    res.render('teacher/dashboard', {
      title: 'Teacher Dashboard', feedbacks, avgRating, bySubject
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard.');
    res.redirect('/login');
  }
};

// GET /teacher/profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.session.user.id } });
    res.render('teacher/profile', { title: 'My Profile', profileUser: user });
  } catch (err) {
    console.error(err);
    res.redirect('/teacher/dashboard');
  }
};

module.exports = { getDashboard, getProfile };
