const express = require("express");
const router  = express.Router();
const customController = require("../../03_controllers/surveys/customController");

// ── 1. Static / Base Routes ───────────────────────────────────────
router.get("/custom-survey",                   customController.showAll);
router.get("/custom-survey/new",               customController.showCreateForm);
router.post("/custom-survey",                  customController.createSurvey);

// ── 2. Specific Sub-Routes (Must be above generic :id) ────────────
router.get("/custom-survey/:id/results",       customController.showResults);
router.post("/custom-survey/:id/delete",       customController.deleteSurvey);

// ── 3. Generic Parameter Routes (Must be at the very bottom) ──────
router.get("/custom-survey/:id",               customController.showSurvey);
router.post("/custom-survey/:id",              customController.submitSurvey);

module.exports = router;