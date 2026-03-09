const express = require("express")
const GET_ALL_BOOK_FILE = require("../../controllers/32. BookFile/1. GET_ALL")
const POST_BOOK_FILES = require("../../controllers/32. BookFile/3. POST")
const GET_SINGLE_BOOK_FILE = require("../../controllers/32. BookFile/2. GET_SINGLE")
const UPDATE_BOOK_FILE = require("../../controllers/32. BookFile/4. UPDATE")
const DELETE_BOOK_FILE = require("../../controllers/32. BookFile/5. DELETE")
const { uploadPdf } = require("../../services/uploadService")

const router = express.Router()

router.route("/book-file")
.get(GET_ALL_BOOK_FILE)
.post(uploadPdf.single(`file`) ,POST_BOOK_FILES)

router.route("/book-file/:id")
.get(GET_SINGLE_BOOK_FILE)
.put(uploadPdf.single(`file`) ,UPDATE_BOOK_FILE)
.delete(DELETE_BOOK_FILE)

module.exports = router