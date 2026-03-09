const express = require("express")
const GET_ALL_LESSON_RATING = require("../../controllers/19. LessonRating/1. GET_ALL")
const POST_LESSON_RATING = require("../../controllers/19. LessonRating/3. POST")
const GET_SINGLE_LESSON_RATING = require("../../controllers/19. LessonRating/2. GET_SINGLE")
const UPDATE_LESSON_RATING = require("../../controllers/19. LessonRating/4. UPDATE")
const DELETE_LESSON_RATING = require("../../controllers/19. LessonRating/5. DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const USER_GET_ALL_LESSON_RATING = require("../../controllers/19. LessonRating/6. USER_GET_ALL")
const USER_POST_LESSON_RATING = require("../../controllers/19. LessonRating/8. USER_POST")
const USER_GET_SINGLE_LESSON_RATING = require("../../controllers/19. LessonRating/7. USER_GET_SINGLE")
const USER_UPDATE_LESSON_RATING = require("../../controllers/19. LessonRating/9. USER_UPDATE")
const USER_DELETE_LESSON_RATING = require("../../controllers/19. LessonRating/10. USER_DELETE")

const router = express.Router()

router.route("/lesson-rating")
.get(GET_ALL_LESSON_RATING)
.post(POST_LESSON_RATING)

router.route("/lesson-rating/:id")
.get(GET_SINGLE_LESSON_RATING)
.put(UPDATE_LESSON_RATING)
.delete(DELETE_LESSON_RATING)

router.route("/me/lesson-rating")
.get(authMiddlewareUser, USER_GET_ALL_LESSON_RATING)
.post(authMiddlewareUser, USER_POST_LESSON_RATING)

router.route("/me/lesson-rating/:id")
.get(authMiddlewareUser, USER_GET_SINGLE_LESSON_RATING)
.put(authMiddlewareUser, USER_UPDATE_LESSON_RATING)
.delete( authMiddlewareUser, USER_DELETE_LESSON_RATING)

module.exports = router