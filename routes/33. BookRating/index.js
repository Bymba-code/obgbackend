const express = require("express")
const GET_ALL_BOOK_RATING = require("../../controllers/33. BookRating/1. GET_ALL")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const POST_BOOK_RATING = require("../../controllers/33. BookRating/3. POST")
const GET_SINGLE_BOOK_RATING = require("../../controllers/33. BookRating/2. GET_SINGLE")
const UPDATE_BOOK_RATING = require("../../controllers/33. BookRating/4. UPDATE")
const DELETE_BOOK_RATING = require("../../controllers/33. BookRating/5. DELETE")

const router = express.Router()

router.route("/book-rating")
.get(GET_ALL_BOOK_RATING)
.post(authMiddlewareUser, POST_BOOK_RATING)

router.route("/book-rating/:id")
.get(GET_SINGLE_BOOK_RATING)
.put(authMiddlewareUser, UPDATE_BOOK_RATING)
.delete(authMiddlewareUser, DELETE_BOOK_RATING)

module.exports = router