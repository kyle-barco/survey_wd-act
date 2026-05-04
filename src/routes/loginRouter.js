const { Router } = require("express");
const passport = require("passport");

const loginRouter = Router();

loginRouter.get("/", async (req, res) => {
  res.render("login");
});

loginRouter.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err)
    }

    if(!user) {
      return res
              .status(400)
              .render("login", {errors: [{msg: "Invalid email/password"}]})
    }

    req.logIn(user, (err) => {
      if(err) {
        return next(err)
      }
      return res.redirect("/")
    })
  })(req, res, next)
})

module.exports = loginRouter;
