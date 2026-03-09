const express = require("express")
const GET_ALL_SECOND_UNITS = require("../../controllers/3. SecondUnits/1. GET_ALL")
const POST_SECOND_UNIT = require("../../controllers/3. SecondUnits/3. POST")
const UPDATE_SECOND_UNIT = require("../../controllers/3. SecondUnits/4. UPDATE")
const DELETE_SECOND_UNIT = require("../../controllers/3. SecondUnits/5. DELETE")
const GET_SINGLE_SECOND_UNIT = require("../../controllers/3. SecondUnits/2. GET_SINGLE")

const router = express.Router()

router.route("/second-units")
.get(GET_ALL_SECOND_UNITS)
.post(POST_SECOND_UNIT)

router.route("/second-units/:id")
.get(GET_SINGLE_SECOND_UNIT)
.put(UPDATE_SECOND_UNIT)
.delete(DELETE_SECOND_UNIT)


module.exports = router