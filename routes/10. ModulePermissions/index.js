const express = require("express")
const GET_ALL_MODULE_PERMISSION = require("../../controllers/10. ModulePermissions/1. GET_ALL")
const POST_MODULE_PERMISSION = require("../../controllers/10. ModulePermissions/3. POST")
const GET_SINGLE_MODULE_PERMISSION = require("../../controllers/10. ModulePermissions/2. GET_SINGLE")
const UPDATE_MODULE_PERMISSIONS = require("../../controllers/10. ModulePermissions/4. UPDATE")
const DELETE_MODULE_PERMISSION = require("../../controllers/10. ModulePermissions/5. DELETE")

const router = express.Router()

router.route("/module-permission")
.get(GET_ALL_MODULE_PERMISSION)
.post(POST_MODULE_PERMISSION)

router.route("/module-permission/:id")
.get(GET_SINGLE_MODULE_PERMISSION)
.put(UPDATE_MODULE_PERMISSIONS)
.delete(DELETE_MODULE_PERMISSION)

module.exports = router