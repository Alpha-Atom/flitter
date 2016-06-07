const express = require("express")
const router = require("./routes/router.js")
const bodyParser = require('body-parser')
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use("/", router)

app.listen(3000, () => console.log("Listening on port 3000."))

process.on('SIGINT', () => process.exit(0))
