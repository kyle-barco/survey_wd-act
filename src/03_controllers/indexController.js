const { prisma } = require("../../lib/prisma");

exports.showIndex = async (req, res, next) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: { classroom: true }
    })
    res.render("index", { user: req.user, surveys })
  } catch (error) {
    next(error)
  }
}