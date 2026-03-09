const express = require("express")
const POST_NOTIFICATION = require("../../controllers/28. Notification/3. POST")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const USER_GET_ALL_NOTIFICATION = require("../../controllers/28. Notification/6. USER_GET_ALL")

const router = express.Router()

router.route("/notification")
.post(POST_NOTIFICATION)

router.route("/users/:id")

router.route("/me/notification")
.get(authMiddlewareUser, USER_GET_ALL_NOTIFICATION)

module.exports = router