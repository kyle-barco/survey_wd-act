const { prisma } = require("../../lib/prisma");

exports.showProfile = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/login");

    let surveys = [];
    let disasterSurveys = [];
    let feedbacks = [];

    if (req.user.role === "TEACHER") {
      [surveys, disasterSurveys] = await Promise.all([
        prisma.survey.findMany({
          where: { classroom: { teacherId: req.user.id } },
          include: { classroom: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.disasterSurvey.findMany({
          where: { adminId: req.user.id },
          orderBy: { createdAt: "desc" },
        }),
      ]);
    }

    if (req.user.role === "STUDENT") {
      feedbacks = await prisma.feedback.findMany({
        where: { studentId: req.user.id },
        include: { survey: true },
        orderBy: { createdAt: "desc" },
      });
    }

    res.render("profile", { user: req.user, surveys, disasterSurveys, feedbacks });
  } catch (error) {
    next(error);
  }
};