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

db.on("error", console.log.bind(console, "Connection error:"))
db.once("open", function() {
  console.log("Connected to database.")
})

const GroupSchema = new mongoose.Schema({
  groupname: String,
  code: String,
  owner: String,
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

  User.register(newUser, req.body.password, (error, user) => {
    if (error) {
      console.log(error)
      
      res.json(error)
    } else {
      passport.authenticate("local") (req, res, () => {
        console.log("success")

        res.json(user)
      })
    }
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
  // groupname
  // owner
  // create groupname, owner, random code
  // or return error if group already exists
  // send group name and code back

  console.log(req.body)
  //console.log("user: ", req.user)

  const groupname = req.body.groupname
  const owner = "user" //req.user.username
  const code = Math.random().toString(36).substring(2, 7);

  Group.findOneAndUpdate({groupname: groupname, owner: owner}, {}, {upsert: true}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data === null) {
        res.json({status: "new group created", data: data})
      } else {
        res.json({status: "group exists", data: data})
      }
    }
  })
})

app.post("/join", (req, res) => {
  // username
  // groupname
  // code

  res.json("join")
})

app.post("/leave", (req, res) => {
  // username
  // groupname

  res.json("leave")
})

app.post("/mywishlist", (req, res) => {
  // username
  // groupname
  // wishlist entries

  res.json("mywishlist")
})

app.post("/partnerwishlist", (req, res) => {
  // username
  // groupname

  res.json("partnerwishlist")
})

// SERVER
app.listen(port, () => console.log(`Server running on port ${port}!`))