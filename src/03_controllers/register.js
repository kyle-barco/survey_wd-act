const { body, validationResult, matchedData } = require("express-validator");
const userQuery = require("../01_models/userQuery.js");

const validateUserData = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("role").isIn(["STUDENT", "TEACHER"]).withMessage("Invalid role"),
  body("password")
    .trim()
    .isStrongPassword({
      minSymbols: 0,
    })
    .withMessage(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    ),
];

exports.processRegister = [
  validateUserData,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        errors: errors.array(),
        oldData: req.body,
      });
    }

    try {
      const userData = matchedData(req);
      await userQuery.userRegister({
        userName: userData.name,
        userEmail: userData.email,
        password: userData.password,
        role: userData.role,
      });

      res.redirect("/");
    } catch (error) {
      console.log("code:", error.code);
      console.log("meta:", JSON.stringify(error.meta)); // full structure

      const isUniqueEmail =
        error.code === "P2002" && JSON.stringify(error.meta).includes("email"); // catch any structure

      if (isUniqueEmail) {
        return res.status(400).render("register", {
          errors: [{ path: "email", msg: "Email is already taken" }],
          oldData: req.body,
        });
      }
      next(error);
    }
  },
];
