const express = require("express")
const GET_ALL_RULES = require("../../controllers/29. Rules/1. GET_ALL")
const POST_RULES = require("../../controllers/29. Rules/3. POST")
const GET_SINGLE_RULES = require("../../controllers/29. Rules/2. GET_SINGLE")
const UPDATE_RULES = require("../../controllers/29. Rules/4. UPDATE")
const DELETE_RULES = require("../../controllers/29. Rules/5. DELETE")
const { upload, uploadPdf } = require("../../services/uploadService")

const router = express.Router()

router.route("/rules")
.get(GET_ALL_RULES)
.post(uploadPdf.single(`file`), POST_RULES)

router.route("/rules/:id")
.get(GET_SINGLE_RULES)
.put(uploadPdf.single(`file`),  UPDATE_RULES)
.delete(DELETE_RULES)

module.exports = router