const express               = require('express')
const path                  = require("path")
const mongoose              = require("mongoose")
const bodyParser            = require("body-parser")
const passport              = require("passport")
const LocalStrategy         = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config()

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, "dist/secret-santa")))
app.use(bodyParser.urlencoded({extended: false}));

// MONGOOSE
mongoose.connect(process.env.DB)

const db = mongoose.connection

db.on("error", console.log.bind(console, "connection error:"))
db.once("open", function() {
  console.log("connected to db")
})

const GroupSchema = new mongoose.Schema({
  name: String,
  code: String,
  members: {
    name: String,
    wishlist: [String],
    partner: String
  }
})

const Group = mongoose.model("Group", GroupSchema)

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  groups: [String]
})

// enable passport functions on users
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", UserSchema)

// PASSPORT
app.use(require("express-session")({
  secret: "secret message",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

function isLoggedIn(req, res, next) {
  if (req.isAuthenticate()) {
    return next()
  }
  //res.redirect("/login")
}

/*
app.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret")
})
*/

// START
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dist/secret-santa/index.html"))
})

// ACCOUNT
app.post("/register", (req, res) => {
  console.log("register: ", req.body)

  const newUser = new User({username: req.body.username, email: req.body.email})

  User.register(newUser, req.body.password, (err, user) => {
    if (err) console.log(err)
    passport.authenticate("local") (req, res, () => {
      console.log("success")
    })
  })
})

app.post("/login", passport.authenticate("local", {
  //successRedirect: "/",
  //failureRedirect: "/login"
}), (req, res) => {
  console.log(req.body)

  res.json("success")
})

// GROUPS
app.post("/create", (req, res) => {
  // receive group name and owner
  // check if exists and warn
  // otherwise create with groupname, owner, random code
  // send group name and random code back

  console.log(req.body)

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

// SERVER
app.listen(port, () => console.log(`Server running on port ${port}!`))