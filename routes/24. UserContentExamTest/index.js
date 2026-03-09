const express = require("express")
const POST_USER_LESSON_CONTENT_TEST = require("../../controllers/24. UserContentExamTest/3. POST")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/user-content-test-answers")
.post(authMiddlewareUser, POST_USER_LESSON_CONTENT_TEST)

module.exports = router