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
  launched: Boolean,
  members: [{
    username: String,
    wishlist: [String],
    partner: String
  }]
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
  if (req.user) {
    return next()
  } else {
    res.json("not authenticated")
  }
}

// START
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "dist/secret-santa/index.html"))
})

// ACCOUNT
app.post("/register", (req, res) => {
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

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json("success")
})

// GROUPS
app.post("/create", isLoggedIn, (req, res) => {
  // groupname
  // owner
  // create groupname, owner, random code
  // or return error if group already exists
  // send group name and code back

  const groupname = req.body.groupname
  const owner = req.user.username
  const code = Math.random().toString(36).substring(2, 7);

  Group.findOneAndUpdate({groupname: groupname, owner: owner}, {code: code}, {upsert: true}, (error, data) => {
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

app.post("/join", isLoggedIn, (req, res) => {
  // username
  // groupname
  // code

  const groupname = req.body.groupname
  const code = req.body.code
  const username = req.user.username

  Group.findOne({groupname: groupname, code: code, members: {$elemMatch: {username: username}}}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data === null) {
        Group.findOneAndUpdate({groupname: groupname, code: code}, {$push: {members: {username: username}}}, {new: true}, (error, data) => {
          res.json({status: "member created", data: data})
        })
      } else {
        res.json({status: "member exists", data: data})
      }
    }
  })
})

app.post("/leave", (req, res) => {
  // username
  // groupname

  // check if not found

  const username = req.user.username
  const groupname = req.body.groupname

  Group.findOneAndUpdate({groupname: groupname}, {$pull: {members: {username: username}}}, {new: true}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data === null) {
        res.json({status: "not found", data: data})
      } else {
        res.json({status: "deleted", data: data})
      }
    }
  })
})

app.post("/mywishlist", isLoggedIn, (req, res) => {
  // username
  // groupname
  // code
  // wishlist entries

  // receive wishlist as json
  // convert to array

  const groupname = req.body.groupname
  const wishlist = req.body.mywishlist
  const code = req.body.code
  const username = req.user.username

  console.log(wishlist)

  Group.findOneAndUpdate({groupname: groupname, code: code, "members.username": username}, {"members.$.wishlist": wishlist}, {new: true, fields: {"members.$.wishlist": 1}}, (error, data) => {
    res.json({status: "wishlist changed", data: data})
  })
})

app.post("/partnerwishlist", isLoggedIn, (req, res) => {
  // username
  // groupname
  // code

  const groupname = req.body.groupname
  const username = req.user.username
  const code = req.body.code
  let partner = ""

  Group.findOne({groupname: groupname, code: code, launched: true}, {members: {$elemMatch: {username: username}}}, (error, data) => {
    if (error) console.log(error)
    else {
      partner = data.members[0].partner

      console.log(partner)

      Group.findOne({groupname: groupname, code: code}, {members: {$elemMatch: {username: partner}}}, (error, data) => {
        res.json({partner: data.members[0].username, partnerwishlist: data.members[0].wishlist})
      })
    }
  })
})

app.post("/launch", isLoggedIn, (req, res) => {
  // owner
  // groupname
  // code

  function shuffleArray(items) {
    for (let i = items.length; i-- > 1; ) {
      let j = Math.floor(Math.random() * i);
      let temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }
  }

  const username = req.user.username
  const groupname = req.body.groupname
  const code = req.body.code
  let partners = []

  Group.findOne({groupname: groupname, code: code}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data === null) {
        res.json("groupname not found")
      } else if (data.launched === true) {
        res.json({status: "already launched", data: data})
      } else if (data.owner === username) {
        data.members.forEach(e => {
          partners.push(e.username)
        })

        shuffleArray(partners)

        data.members.forEach((e, i) => {
          e.partner = partners[i]
        })

        Group.findOneAndUpdate({groupname: groupname, code: code}, {members: data.members, launched: true}, {new: true}, (error, data) => {
          if (error) console.log(error)
          else {
            res.json({status: "active user is the owner, launched now", data: data})
          }
        })
      } else {
        res.json({status: "active user is not the owner", data: data})
      }
    }
  })
})

// SERVER
app.listen(port, () => console.log(`Server running on port ${port}!`))