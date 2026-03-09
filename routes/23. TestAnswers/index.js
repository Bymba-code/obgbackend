const express = require("express")
const GET_ALL_TEST_ANSWERS = require("../../controllers/23. TestAnswers/1. GET_ALL")
const POST_TEST_ANSWERS = require("../../controllers/23. TestAnswers/3. POST")
const GET_SINGLE_TEST_ANSWERS = require("../../controllers/23. TestAnswers/2. GET_SINGLE")
const UPDATE_TEST_ANSWERS = require("../../controllers/23. TestAnswers/4. UPDATE")
const DELETE_TEST_ANSWERS = require("../../controllers/23. TestAnswers/5. DELETE")

const router = express.Router()

router.route("/test-answers")
.get(GET_ALL_TEST_ANSWERS)
.post(POST_TEST_ANSWERS)

router.route("/test-answers/:id")
.get(GET_SINGLE_TEST_ANSWERS)
.put(UPDATE_TEST_ANSWERS)
.delete(DELETE_TEST_ANSWERS)

module.exports = router