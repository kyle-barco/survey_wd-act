const { prisma } = require("../../lib/prisma");
const manifest = require("../../public/dist/.vite/manifest.json");

exports.showIndex = async (req, res, next) => {
  try {
    const [surveys, disasterSurveys] = await Promise.all([
      prisma.survey.findMany({
        include: { classroom: true },
      }),
      prisma.disasterSurvey.findMany({
        include: { admin: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!req.user) {
      return res.render("hero", { layout: false });
    }

    res.render("index", { user: req.user, surveys, disasterSurveys });
  } catch (error) {
    next(error);
  }
};


exports.showHome = async (req, res, next) => {
  try {
    const classroomSurvey = await prisma.survey.findFirst({
      orderBy: { createdAt: "desc" },
    });

    res.render("index", {
      user: req.user || null,
      classroomSurvey: classroomSurvey || null,
    });
  } catch (error) {
    next(error);
  }
};
