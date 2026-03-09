const express = require("express")
const POST_LESSON_VISIBLITY = require("../../controllers/14. LessonVisiblity/3. POST")
const DELETE_LESSON_VISIBLITY = require("../../controllers/14. LessonVisiblity/5. DELETE")

const router = express.Router()

router.route("/lesson-visiblity")
.post(POST_LESSON_VISIBLITY)

router.route("/lesson-visiblity/:id")
.delete(DELETE_LESSON_VISIBLITY)


module.exports = router