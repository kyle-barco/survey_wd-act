const { Router } = require("express");

const profileController = require("../03_controllers/profileController");

const router = Router()

router.get("/", profileController.showProfile);

module.exports = router