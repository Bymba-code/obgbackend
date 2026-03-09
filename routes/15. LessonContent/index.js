const express = require("express")
const GET_ALL_LESSON_CONTENT = require("../../controllers/15. LessonContent/1. GET_ALL")
const POST_LESSON_CONTENT = require("../../controllers/15. LessonContent/3. POST")
const GET_SINGLE_LESSON_CONTENT = require("../../controllers/15. LessonContent/2. GET_SINGLE")
const UPDATE_LESSON_CONTENT = require("../../controllers/15. LessonContent/4. UPDATE")
const DELETE_LESSON_CONTENT = require("../../controllers/15. LessonContent/5. DELETE")

const router = express.Router()

router.route("/lesson-content")
.get(GET_ALL_LESSON_CONTENT)
.post(POST_LESSON_CONTENT)

router.route("/lesson-content/:id")
.get(GET_SINGLE_LESSON_CONTENT)
.put(UPDATE_LESSON_CONTENT)
.delete(DELETE_LESSON_CONTENT)


module.exports = router