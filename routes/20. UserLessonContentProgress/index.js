const express = require("express")
const POST_USER_LESSON_CONTENT_PROGRESS = require("../../controllers/20. UserLessonContentProgress/3. POST")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/user-content-progress")
.post(authMiddlewareUser, POST_USER_LESSON_CONTENT_PROGRESS)

module.exports = router