const express = require("express")
const REGISTER_USER = require("../../controllers/1. Authenticate/1. RegisterUser")
const LOGIN_USER = require("../../controllers/1. Authenticate/2. LoginUser")
const ME_USER = require("../../controllers/1. Authenticate/3. Authenticate")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/user/register")
.post(REGISTER_USER)

router.route("/user/login")
.post(LOGIN_USER)

router.route("/me/user")
.get(authMiddlewareUser ,ME_USER)

module.exports = router