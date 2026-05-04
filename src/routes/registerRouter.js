const { Router } = require("express");
const { processRegister } = require("../03_controllers/register");

const registerRouter = Router()

registerRouter.get('/', (req, res) => {
    res.render('register')
})
registerRouter.post('/', processRegister)

module.exports = registerRouter
