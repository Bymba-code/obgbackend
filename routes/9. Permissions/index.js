const express = require("express")
const GET_ALL_PERMISSION = require("../../controllers/9. Permissions/1. GET_ALL")
const POST_PERMISSION = require("../../controllers/9. Permissions/3. POST")
const GET_SINGLE_PERMISSION = require("../../controllers/9. Permissions/2. GET_SINGLE")
const UPDATE_PERMISSION = require("../../controllers/9. Permissions/4. UPDATE")
const DELETE_PERMISSION = require("../../controllers/9. Permissions/5. DELETE")

const router = express.Router()

router.route("/permission")
.get(GET_ALL_PERMISSION)
.post(POST_PERMISSION)

router.route("/permission/:id")
.get(GET_SINGLE_PERMISSION)
.put(UPDATE_PERMISSION)
.delete(DELETE_PERMISSION)

module.exports = router