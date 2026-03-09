const express = require("express")
const GET_ALL_POSITIONS = require("../../controllers/6. Positions/1. GET_ALL")
const POST_POSITIONS = require("../../controllers/6. Positions/3. POST")
const GET_SINGLE_POSITIONS = require("../../controllers/6. Positions/2. GET_SINGLE")
const UPDATE_POSITIONS = require("../../controllers/6. Positions/4. UPDATE")
const DELETE_POSITIONS = require("../../controllers/6. Positions/5. DELETE")

const router = express.Router()

router.route("/positions")
.get(GET_ALL_POSITIONS)
.post(POST_POSITIONS)

router.route("/positions/:id")
.get(GET_SINGLE_POSITIONS)
.put(UPDATE_POSITIONS)
.delete(DELETE_POSITIONS)


module.exports = router