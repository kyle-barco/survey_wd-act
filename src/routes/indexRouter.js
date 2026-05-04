const { Router } = require("express")
const { showIndex } = require("../03_controllers/indexController")

const indexRouter = Router()

indexRouter.get("/", showIndex)

module.exports = indexRouter