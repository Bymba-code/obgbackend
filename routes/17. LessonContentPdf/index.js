const express = require("express")
const { upload, uploadPdf } = require("../../services/uploadService")
const GET_ALL_LESSON_CONTENT_PDF = require("../../controllers/17. LessonContentPdf/1. GET_ALL")
const POST_LESSON_CONTENT_PDF = require("../../controllers/17. LessonContentPdf/3. POST")
const GET_SINGLE_LESSON_CONTENT_PDF = require("../../controllers/17. LessonContentPdf/2. GET_SINGLE")
const UPDATE_LESSON_CONTENT_PDF = require("../../controllers/17. LessonContentPdf/4. UPDATE")
const DELETE_LESSON_CONTENT_PDF = require("../../controllers/17. LessonContentPdf/5. DELETE")

const router = express.Router()

router.route("/lesson-content-pdf")
.get(GET_ALL_LESSON_CONTENT_PDF)
.post(uploadPdf.single(`file`), POST_LESSON_CONTENT_PDF)

router.route("/lesson-content-pdf/:id")
.get(GET_SINGLE_LESSON_CONTENT_PDF)
.put(uploadPdf.single(`file`), UPDATE_LESSON_CONTENT_PDF)
.delete(DELETE_LESSON_CONTENT_PDF)

module.exports = router