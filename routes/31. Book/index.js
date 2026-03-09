const express = require("express")
const GET_ALL_BOOK = require("../../controllers/31. Book/1. GET_ALL")
const { upload, uploadPdf, uploadBookFiles } = require("../../services/uploadService")
const POST_BOOK = require("../../controllers/31. Book/3. POST")
const GET_SINGLE_BOOK = require("../../controllers/31. Book/2. GET_SINGLE")
const UPDATE_BOOK = require("../../controllers/31. Book/4. UPDATE")
const DELETE_BOOK = require("../../controllers/31. Book/5. DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const USER_GET_ALL_BOOK = require("../../controllers/31. Book/6. USER_GET_ALL")
const USER_GET_SINGLE_BOOK = require("../../controllers/31. Book/7. USER_GET_SINGLE")
const USER_GET_ALL_OPEN_BOOKS = require("../../controllers/31. Book/8. USER_GET_ALL_BOOKS")
const USER_GET_ALL_END_BOOK = require("../../controllers/31. Book/9. USER_GET_ALL_END_BOOKS")

const router = express.Router()

router.route("/book")
.get(GET_ALL_BOOK)
.post(uploadBookFiles.fields([
    { name: "file", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]), POST_BOOK)

router.route("/book/:id")
.get(GET_SINGLE_BOOK)
.put(uploadBookFiles.fields([
    { name: "file", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]) ,UPDATE_BOOK)
.delete(DELETE_BOOK)

router.route("/me/book")
.get(authMiddlewareUser, USER_GET_ALL_BOOK)

router.route("/me/book-open")
.get(authMiddlewareUser, USER_GET_ALL_OPEN_BOOKS)

router.route("/me/book-end")
.get(authMiddlewareUser, USER_GET_ALL_END_BOOK)

router.route("/me/book/:id")
.get(authMiddlewareUser, USER_GET_SINGLE_BOOK)

module.exports = router