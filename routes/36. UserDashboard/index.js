const express = require("express")
const USER_GET_DASHBOARD = require("../../controllers/36. UserDashboard/1. USER_GET")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/me/dashboard")
.get(authMiddlewareUser, USER_GET_DASHBOARD)

module.exports = router