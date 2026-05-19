const { body, validationResult, matchedData } = require("express-validator");
const userQuery = require("../01_models/userQuery.js");

const validateUserData = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body('birthday')
    .isDate()
    .withMessage('Please enter a valid date.')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      
      let age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 12) {
        throw new Error('You must be 12 years old or older to register.');
      }
      if (age > 120) {
        throw new Error('Age cannot exceed 120 years.');
      }
      return true;
    }),
  // Added validation rule for the new gender enum field
  body("gender").isIn(["MALE", "FEMALE", "OTHER"]).withMessage("Please select a valid gender option"),
  body("role").isIn(["STUDENT", "TEACHER"]).withMessage("Invalid role"),
  // Added optional validation/sanitization rule for institution
  body("institution").trim().optional({ checkFalsy: true }),
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
        layout: false, // Ensures layout wrapper doesn't inject if rendering error states
      });
    }

    try {
      const userData = matchedData(req);
      
      // Included gender, birthday, and institution in the execution object payload
      await userQuery.userRegister({
        userName: userData.name,
        userEmail: userData.email,
        password: userData.password,
        role: userData.role,
        gender: userData.gender,
        birthday: userData.birthday,
        institution: userData.institution,
      });

      res.redirect("/login");
    } catch (error) {
      console.log("code:", error.code);
      console.log("meta:", JSON.stringify(error.meta)); // full structure

      const isUniqueEmail =
        error.code === "P2002" && JSON.stringify(error.meta).includes("email"); // catch any structure

      if (isUniqueEmail) {
        return res.status(400).render("register", {
          errors: [{ path: "email", msg: "Email is already taken" }],
          oldData: req.body,
          layout: false, // Match configuration across routes
        });
      }
      next(error);
    }
  },
];