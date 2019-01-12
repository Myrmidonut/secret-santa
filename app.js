const express    = require('express')
const path       = require("path")
const mongoose   = require("mongoose")
const bodyParser = require("body-parser")

require("dotenv").config()

const app = express()
const port = 3000
const dbUrl = process.env.DB;

mongoose.connect(dbUrl)

const db = mongoose.connection

db.on("error", console.log.bind(console, "connection error:"))
db.once("open", function() {
  console.log("connected to db")
})

const groupSchema = new mongoose.Schema({
  name: String,
  code: String,
  members: {
    name: String,
    wishlist: [String],
    partner: String
  }
})

const Group = mongoose.model("Group", groupSchema)

app.use(express.static(path.join(__dirname, "dist/secret-santa")))
//app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dist/secret-santa/index.html"))
})

app.post("/create", (req, res) => {
  console.log("post /create: ", req.body)
  res.json(req.body)
})

app.post("/join", (req, res) => {
  res.json("join")
})

app.post("/leave", (req, res) => {
  res.json("leave")
})

app.post("/mywishlist", (req, res) => {
  res.json("mywishlist")
})

app.post("/partnerwishlist", (req, res) => {
  res.json("partnerwishlist")
})

app.listen(port, () => console.log(`Server running on port ${port}!`))