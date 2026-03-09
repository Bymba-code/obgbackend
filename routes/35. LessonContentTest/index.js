const express = require("express")
const GET_ALL_LESSON_CONTENT_TEST = require("../../controllers/35. LessonContentTest/1. GET_ALL")
const GET_SINGLE_LESSON_CONTENT_TEST = require("../../controllers/35. LessonContentTest/2. GET_SINGLE")
const POST_LESSON_CONTENT_TEST = require("../../controllers/35. LessonContentTest/3. POST")

const router = express.Router()

router.route("/lesson-content-test")
.get(GET_ALL_LESSON_CONTENT_TEST)
.post(POST_LESSON_CONTENT_TEST)

router.route("/lesson-content-test")
.get(GET_SINGLE_LESSON_CONTENT_TEST)

module.exports = router