const express = require("express")
const GET_ALL_FIRST_UNITS = require("../../controllers/2. FirstUnits/1. GET_ALL")
const GET_SINGLE_FIRST_UNIT = require("../../controllers/2. FirstUnits/2. GET_SINGLE")
const POST_FIRST_UNIT = require("../../controllers/2. FirstUnits/3. POST")
const UPDATE_FIRST_UNIT = require("../../controllers/2. FirstUnits/4. UPDATE")
const DELETE_FIRST_UNIT = require("../../controllers/2. FirstUnits/5. DELETE")

const router = express.Router()

router.route("/first-units")
.get(GET_ALL_FIRST_UNITS)
.post(POST_FIRST_UNIT)

router.route("/first-units/:id")
.get(GET_SINGLE_FIRST_UNIT)
.put(UPDATE_FIRST_UNIT)
.delete(DELETE_FIRST_UNIT)


module.exports = router