const { prisma } = require("../../lib/prisma");
const manifest = require('../../public/dist/.vite/manifest.json');

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

    res.render("index", { user: req.user, surveys, disasterSurveys });
  } catch (error) {
    next(error);
  }
};