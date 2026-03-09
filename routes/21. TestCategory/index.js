const express = require("express")
const GET_ALL_TEST_CATEGORY = require("../../controllers/21. TestCategory/1. GET_ALL")
const POST_TEST_CATEGORY = require("../../controllers/21. TestCategory/3. POST")
const GET_SINGLE_TEST_CATEGORY = require("../../controllers/21. TestCategory/2. GET_SINGLE")
const UPDATE_TEST_CATEGORY = require("../../controllers/21. TestCategory/4. UPDATE")
const DELETE_TEST_CATEGORY = require("../../controllers/21. TestCategory/5. DELETE")

const router = express.Router()

router.route("/test-category")
.get(GET_ALL_TEST_CATEGORY)
.post(POST_TEST_CATEGORY)

router.route("/test-category/:id")
.get(GET_SINGLE_TEST_CATEGORY)
.put(UPDATE_TEST_CATEGORY)
.delete(DELETE_TEST_CATEGORY)

module.exports = router