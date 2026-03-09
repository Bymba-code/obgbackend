const express = require("express")
const GET_ALL_LESSON_CONTENT_VIDEO = require("../../controllers/18. LessonContentVideo/1. GET_ALL")
const POST_LESSON_CONTENT_VIDEO = require("../../controllers/18. LessonContentVideo/3. POST")
const GET_SINGLE_LESSON_CONTENT_VIDEO = require("../../controllers/18. LessonContentVideo/2. GET_SINGLE")
const UPDATE_LESSON_CONTENT_VIDEO = require("../../controllers/18. LessonContentVideo/4. UPDATE")
const DELETE_LESSON_CONTENT_VIDEO = require("../../controllers/18. LessonContentVideo/5. DELETE")

const router = express.Router()

router.route("/lesson-content-video")
.get(GET_ALL_LESSON_CONTENT_VIDEO)
.post(POST_LESSON_CONTENT_VIDEO)

router.route("/lesson-content-video/:id")
.get(GET_SINGLE_LESSON_CONTENT_VIDEO)
.put(UPDATE_LESSON_CONTENT_VIDEO)
.delete(DELETE_LESSON_CONTENT_VIDEO)

module.exports = router