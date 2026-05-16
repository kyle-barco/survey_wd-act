const { prisma } = require("../../lib/prisma");
const manifest = require("../../public/dist/.vite/manifest.json");

exports.showIndex = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.render("hero", { layout: false });
    }

    res.render("index", { user: req.user });
  } catch (error) {
    next(error);
  }
};
