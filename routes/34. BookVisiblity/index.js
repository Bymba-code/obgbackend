const express = require("express")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const DELETE_BOOK_VISIBLITY = require("../../controllers/34. BooksVisiblity/5. DELETE")

const router = express.Router()

router.route("/book-visiblity/:id")
.delete(DELETE_BOOK_VISIBLITY)


module.exports = router