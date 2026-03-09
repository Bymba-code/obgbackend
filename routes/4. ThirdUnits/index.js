const express = require("express")
const GET_ALL_THIRD_UNITS = require("../../controllers/4. ThirdUnits/1. GET_ALL")
const POST_THIRD_UNIT = require("../../controllers/4. ThirdUnits/3. POST")
const GET_SINGLE_THIRD_UNIT = require("../../controllers/4. ThirdUnits/2. GET_SINGLE")
const UPDATE_THIRD_UNIT = require("../../controllers/4. ThirdUnits/4. UPDATE")
const DELETE_THIRD_UNIT = require("../../controllers/4. ThirdUnits/5. DELETE")

const router = express.Router()

router.route("/third-units")
.get(GET_ALL_THIRD_UNITS)
.post(POST_THIRD_UNIT)

router.route("/third-units/:id")
.get(GET_SINGLE_THIRD_UNIT)
.put(UPDATE_THIRD_UNIT)
.delete(DELETE_THIRD_UNIT)


module.exports = router