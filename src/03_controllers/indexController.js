const { prisma } = require("../../lib/prisma");

// Define your team members array here so this controller can pass it to the hero view
const teamMembers = [
    { name: "Kyle Barco", role: "Backend Developer (Lead)", imgUrl: 'https://avatars.githubusercontent.com/u/101305133?v=4' },
    { name: "Muzza Lacamento", role: "Frontend Developer", imgUrl: 'img/muzza.jpg' },
    { name: "Glynicel Vicente", role: "Database Administrator", imgUrl: 'img/glynicel.jpg'},
    { name: "Micah Guda", role: "UI/UX Designer & QA", imgUrl: 'img/micah.jpg'  },
    { name: "Dave Llaguno", role: "Content & Documentation Specialist", imgUrl: 'img/dave.jpg' }
];

exports.showIndex = async (req, res, next) => {
  try {
    if (!req.user) {
      // FIX: Explicitly pass the team array to the hero template!
      return res.render("hero", { team: teamMembers, layout: false }); 
    }

    // If they are logged in, send them to the dashboard/index
    res.render("index", { user: req.user });
  } catch (error) {
    next(error);
  }
};