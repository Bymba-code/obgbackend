const express = require("express")
const POST_USER_MODULE_PERMISSION = require("../../controllers/11. UserModulePermission/3. POST")
const DELETE_USER_MODULE_PERMISSION = require("../../controllers/11. UserModulePermission/5. DELETE")

const router = express.Router()

router.route("/user-modules")
.post(POST_USER_MODULE_PERMISSION)

router.route("/user-modules/:id")
.delete(DELETE_USER_MODULE_PERMISSION)

module.exports = router