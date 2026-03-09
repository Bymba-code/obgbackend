const express = require("express")
const GET_ALL_NEWS_CATEGORY = require("../../controllers/25. News_category/1. GET_ALL")
const POST_NEWS_CATEGORY = require("../../controllers/25. News_category/3. POST")
const GET_SINGLE_NEWS_CATEGORY = require("../../controllers/25. News_category/2. GET_SINGLE")
const UPDATE_NEWS_CATEGORY = require("../../controllers/25. News_category/4. UPDATE")
const DELETE_NEWS_CATEGORY = require("../../controllers/25. News_category/5. DELETE")

const router = express.Router()

router.route("/news-category")
.get(GET_ALL_NEWS_CATEGORY)
.post(POST_NEWS_CATEGORY)

router.route("/news-category/:id")
.get(GET_SINGLE_NEWS_CATEGORY)
.put(UPDATE_NEWS_CATEGORY)
.delete(DELETE_NEWS_CATEGORY)

module.exports = router