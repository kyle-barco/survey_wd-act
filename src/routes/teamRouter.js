const { Router } = require("express");
const teamController = require("../03_controllers/teamController");

const router = Router();

// Points the team page to the showTeam method
router.get("/", teamController.showTeam);

module.exports = router;