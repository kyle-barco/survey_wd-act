const router = require("express").Router();
const ctrl   = require("../../03_controllers/surveys/classroomController"); // fix path to yours

router.get("/",          ctrl.showSurvey);
router.post("/respond",  ctrl.submitSurvey);
router.get("/thank-you", ctrl.thankYou);

module.exports = router;