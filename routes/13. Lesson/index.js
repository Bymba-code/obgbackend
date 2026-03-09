const express = require("express")
const { upload } = require("../../services/uploadService")
const POST_LESSON = require("../../controllers/13. Lesson/3. POST")
const GET_ALL_LESSON = require("../../controllers/13. Lesson/1. GET_ALL")
const GET_SINGLE_LESSON = require("../../controllers/13. Lesson/2. GET_SINGLE")
const UPDATE_LESSON = require("../../controllers/13. Lesson/4. UPDATE")
const DELETE_LESSON = require("../../controllers/13. Lesson/5. DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const USER_GET_ALL_LESSON = require("../../controllers/13. Lesson/6. USER_GET_ALL")
const USER_GET_ALL_OPEN_LESSONS = require("../../controllers/13. Lesson/7. USER_GET_LESSONS_OPEN")
const USER_GET_LESSONS_END = require("../../controllers/13. Lesson/8. USER_LESSONS_END")
const USER_GET_SINGLE_LESSON = require("../../controllers/13. Lesson/9. USER_GET_SINGLE")

const router = express.Router()

router.route("/lesson")
.post(upload.single(`file`), POST_LESSON)
.get(GET_ALL_LESSON)

router.route("/lesson/:id")
.get(authMiddlewareUser, GET_SINGLE_LESSON)
.put(upload.single(`file`), UPDATE_LESSON)
.delete(DELETE_LESSON)

router.route("/me/lesson")
.get(authMiddlewareUser, USER_GET_ALL_LESSON)

router.route("/me/lesson/:id")
.get(authMiddlewareUser, USER_GET_SINGLE_LESSON)

router.route("/open/lessons")
.get(authMiddlewareUser, USER_GET_ALL_OPEN_LESSONS)

router.route("/end/lesson")
.get(authMiddlewareUser, USER_GET_LESSONS_END)

module.exports = router