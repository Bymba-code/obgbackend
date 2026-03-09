const express = require("express")
const USER_GET_DASHBOARD = require("../../controllers/36. UserDashboard/1. USER_GET")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const GET_ALL_ANGILAL_SURGALT = require("../../controllers/37. AngilalSurgalt/1. GET_ALL")
const POST_ANGILAL_SURGALT = require("../../controllers/37. AngilalSurgalt/3. POST")
const GET_ANGILAL_SURGALT_REPORT = require("../../controllers/37. AngilalSurgalt/2. GET_SINGLE")

const router = express.Router()

router.route("/angilal-surgalt")
.get(authMiddlewareUser, GET_ALL_ANGILAL_SURGALT)
.post(authMiddlewareUser, POST_ANGILAL_SURGALT)

router.route("/angilal-surgalt-report")
.get(authMiddlewareUser, GET_ANGILAL_SURGALT_REPORT)

module.exports = router