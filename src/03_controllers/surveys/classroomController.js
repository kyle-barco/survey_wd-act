const classroomQuery = require("../../01_models/surveys/classroomQuery")

exports.showSurvey = async (req, res, next) => {
  try {
    const survey = await classroomQuery.getClassroomSurveyById(req.params.id)
    console.log(survey)
    if (!survey) return res.status(404).render("404")
    res.render("classroom", { survey })
  } catch (error) {
    next(error)
  }
}