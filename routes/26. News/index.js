const express = require("express")
const GET_ALL_NEWS = require("../../controllers/26. News/1. GET_ALL")
const POST_NEWS = require("../../controllers/26. News/3. POST")
const GET_SINGLE_NEWS = require("../../controllers/26. News/2. GET_SINGLE")
const UPDATE_NEWS = require("../../controllers/26. News/4. UPDATE")
const DELETE_NEWS = require("../../controllers/26. News/5. DELETE")
const { upload } = require("../../services/uploadService")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/news")
.get(authMiddlewareUser, GET_ALL_NEWS)
.post(authMiddlewareUser, upload.single(`file`), POST_NEWS)

router.route("/news/:id")
.get(authMiddlewareUser,GET_SINGLE_NEWS)
.put(authMiddlewareUser, upload.single(`file`), UPDATE_NEWS)
.delete(authMiddlewareUser, DELETE_NEWS)

module.exports = router