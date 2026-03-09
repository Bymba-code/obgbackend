const express = require("express")
const GET_ALL_LESSON_CONTENT_IMAGE = require("../../controllers/16. LessonContentImage/1. GET_ALL")
const POST_LESSON_CONTENT_IMAGE = require("../../controllers/16. LessonContentImage/3. POST")
const GET_SINGLE_LESSON_CONTENT_IMAGE = require("../../controllers/16. LessonContentImage/2. GET_SINGLE")
const UPDATE_LESSON_CONTENT_IMAGE = require("../../controllers/16. LessonContentImage/4. UPDATE")
const DELETE_LESSON_CONTENT_IMAGE = require("../../controllers/16. LessonContentImage/5. DELETE")
const { upload } = require("../../services/uploadService")

const router = express.Router()

router.route("/lesson-content-image")
.get(GET_ALL_LESSON_CONTENT_IMAGE)
.post(upload.single(`file`), POST_LESSON_CONTENT_IMAGE)

router.route("/lesson-content-image/:id")
.get(GET_SINGLE_LESSON_CONTENT_IMAGE)
.put(upload.single(`file`), UPDATE_LESSON_CONTENT_IMAGE)
.delete(DELETE_LESSON_CONTENT_IMAGE)

module.exports = router