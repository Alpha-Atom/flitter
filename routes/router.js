const express = require("express")
const hello   = require("./misc/hello.js")

const router = express.Router()

router.get("/hello/(:name)?", hello);

module.exports = router
