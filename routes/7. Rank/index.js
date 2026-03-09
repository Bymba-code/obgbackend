const express = require("express")
const GET_ALL_RANKS = require("../../controllers/7. Rank/1. GET_ALL")
const POST_RANKS = require("../../controllers/7. Rank/3. POST")
const GET_SINGLE_RANKS = require("../../controllers/7. Rank/2. GET_SINGLE")
const UPDATE_RANK = require("../../controllers/7. Rank/4. UPDATE")
const DELETE_RANK = require("../../controllers/7. Rank/5. DELETE")

const router = express.Router()

router.route("/rank")
.get(GET_ALL_RANKS)
.post(POST_RANKS)

router.route("/rank/:id")
.get(GET_SINGLE_RANKS)
.put(UPDATE_RANK)
.delete(DELETE_RANK)


module.exports = router