const express = require("express")
const GET_ALL_BOOK_CATEGORY = require("../../controllers/30. BookCategories/1. GET_ALL")
const POST_BOOK_CATEGORY = require("../../controllers/30. BookCategories/3. POST")
const GET_SINGLE_BOOK_CATEGORY = require("../../controllers/30. BookCategories/2. GET_SINGLE")
const UPDATE_BOOK_CATEGORY = require("../../controllers/30. BookCategories/4. UPDATE")
const DELETE_BOOK_CATEGORY = require("../../controllers/30. BookCategories/5. DELETE")

const router = express.Router()

router.route("/book-category")
.get(GET_ALL_BOOK_CATEGORY)
.post(POST_BOOK_CATEGORY)

router.route("/book-category/:id")
.get(GET_SINGLE_BOOK_CATEGORY)
.put(UPDATE_BOOK_CATEGORY)
.delete(DELETE_BOOK_CATEGORY)

module.exports = router