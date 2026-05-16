const {Router} = require("express")
const teamController = require("../03_controllers/teamController")

const router = Router()
router.get("/", teamController.showTeam)

module.exports = router