const express = require("express")
const GET_ALL_LESSON_CATEGORY = require("../../controllers/12. LessonCategory/1. GET_ALL")
const POST_LESSON_CATEGORY = require("../../controllers/12. LessonCategory/3. POST")
const GET_SINGLE_LESSON_CATEGORY = require("../../controllers/12. LessonCategory/2. GET_SINGLE")
const UPDATE_LESSON_CATEGORY = require("../../controllers/12. LessonCategory/4. UPDATE")
const DELETE_LESSON_CATEGORY = require("../../controllers/12. LessonCategory/5. DELETE")

const router = express.Router()

router.route("/lesson-category")
.get(GET_ALL_LESSON_CATEGORY)
.post(POST_LESSON_CATEGORY)

router.route("/lesson-category/:id")
.get(GET_SINGLE_LESSON_CATEGORY)
.put(UPDATE_LESSON_CATEGORY)
.delete(DELETE_LESSON_CATEGORY)

module.exports = router