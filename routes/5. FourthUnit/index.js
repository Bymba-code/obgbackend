const express = require("express")
const GET_ALL_FOURTH_UNITS = require("../../controllers/5. FourthUnit/1. GET_ALL")
const POST_FOURTH_UNIT = require("../../controllers/5. FourthUnit/3. POST")
const GET_SINGLE_FOURTH_UNIT = require("../../controllers/5. FourthUnit/2. GET_SINGLE")
const UPDATE_FOURTH_UNIT = require("../../controllers/5. FourthUnit/4. UPDATE")
const DELETE_FOURTH_UNIT = require("../../controllers/5. FourthUnit/5. DELETE")

const router = express.Router()

router.route("/fourth-units")
.get(GET_ALL_FOURTH_UNITS)
.post(POST_FOURTH_UNIT)

router.route("/fourth-units/:id")
.get(GET_SINGLE_FOURTH_UNIT)
.put(UPDATE_FOURTH_UNIT)
.delete(DELETE_FOURTH_UNIT)


module.exports = router