const express = require("express")
const GET_ALL_MODULES = require("../../controllers/8. Modules/1. GET_ALL")
const GET_SINGLE_MODULE = require("../../controllers/8. Modules/2. GET_SINGLE")
const UPDATE_MODULE = require("../../controllers/8. Modules/4. UPDATE")
const DELETE_MODULE = require("../../controllers/8. Modules/5. DELETE")
const POST_MODULE = require("../../controllers/8. Modules/3. POST")

const router = express.Router()

router.route("/module")
.get(GET_ALL_MODULES)
.post(POST_MODULE)

router.route("/module/:id")
.get(GET_SINGLE_MODULE)
.put(UPDATE_MODULE)
.delete(DELETE_MODULE)

module.exports = router