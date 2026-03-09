const express = require("express")
const GET_ALL_USERS = require("../../controllers/27. Users/1. GET_ALL")
const GET_SINGLE_USERS = require("../../controllers/27. Users/2. GET_SINGLE")

const router = express.Router()

router.route("/users")
.get(GET_ALL_USERS)

router.route("/users/:id")
.get(GET_SINGLE_USERS)

module.exports = router