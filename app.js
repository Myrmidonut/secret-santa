const express               = require('express')
const session               = require("express-session")
const path                  = require("path")
const mongoose              = require("mongoose")
const bodyParser            = require("body-parser")
const passport              = require("passport")
const LocalStrategy         = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const sanitizer             = require("express-sanitizer")
require("dotenv").config()

const User                  = require("./models/user")
const Group                 = require("./models/group")

const account               = require("./routes/account")
const group                 = require("./routes/group")
const wishlist              = require("./routes/wishlist")

const app = express()
const port = process.env.PORT || 3000;

// ANGULAR PRODUCTION FOLDER
app.use(express.static(path.join(__dirname, "/dist/")))

// BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));

// SANITIZER
app.use(sanitizer())

// MONGOOSE
mongoose.connect(process.env.DB, { useNewUrlParser: true })

const db = mongoose.connection

db.on("error", console.log.bind(console, "Connection error:"))
db.once("open", function() {
  console.log("Connected to database.")
})

// EXPRESS SESSION
app.use(session({
  secret: "secret message",
  resave: false,
  saveUninitialized: false
}))

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// START
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"))
})

// ROUTES
app.use("/", account)
app.use("/", group)
app.use("/", wishlist)

// FALLBACK
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"))
})

// SERVER
app.listen(port, () => console.log(`Server running on port ${port}!`))