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

const app = express()
const port = process.env.PORT || 3000;

// FOLDER
// local
//app.use(express.static(path.join(__dirname, "dist/secret-santa")))
// Heroku
app.use(express.static(path.join(__dirname, "/dist/")))

// BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));

// SANITIZER
app.use(sanitizer())

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
    wishlist: [{
      title: String,
      description: String,
      link: String
    }],
    partner: String
  }]
})

const Group = mongoose.model("Group", GroupSchema)

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  groups: [String],
  owner: [String]
})

// enable passport functions on users
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", UserSchema)

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
  const username = req.sanitize(req.body.username)
  const email = req.sanitize(req.body.email)
  const password = req.sanitize(req.body.password)

  const newUser = new User({username: username, email: email})

  User.register(newUser, password, (error, user) => {
    if (error) {
      res.json(error)
    } else {
      passport.authenticate("local") (req, res, () => {
        res.json({username: user.username})
      })
    }
  })
})

/*
app.post("/login", passport.authenticate("local"), (req, res) => {
  User.findOne({username: req.user.username}, (error, data) => {
    if (error) console.log(error)
    else {
      res.json({status: "logged in", username: data.username, groups: data.groups, owner: data.owner})
    }
  })
})
*/

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({status: "Login failed."});
    }

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
    
      User.findOne({username: req.user.username}, (error, data) => {
        if (error) console.log(error)
        else {
          res.json({status: "logged in", username: data.username, groups: data.groups, owner: data.owner})
        }
      })
    });      
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout()
  res.json({status: "Logged out"})
})

app.get("/loginstatus", (req, res) => {
  if (req.user) {
    res.json({username: req.user.username})
  } else {
    res.json({status: "Not logged in."})
  }
})

// GROUPS
app.post("/create", isLoggedIn, (req, res) => {
  const groupname = req.sanitize(req.body.groupname)
  const owner = req.user.username
  const code = Math.random().toString(36).substring(2, 7);

  Group.findOne({groupname: groupname}, (error1, data1) => {
    if (error1) console.log(error1)
    else {
      if (data1 === null) {
        Group.findOneAndUpdate({groupname: groupname}, {code: code, owner: owner, launched: false, $push: {members: {username: owner}}}, {upsert: true}, (error2, data2) => {
          if (error2) console.log(error2)
          else {
            User.findOneAndUpdate({username: owner}, {$push: {groups: groupname, owner: groupname}}, {new: true}, (error3, data3) => {
              if (error3) console.log(error3)
              else {
                res.json({status: "new group created", groupname: groupname, code: code})
              }
            })
          }
        })
      } else {
        res.json({status: "group exists already"})
      }
    }
  })
})

app.post("/join", isLoggedIn, (req, res) => {
  const groupname = req.sanitize(req.body.groupname)
  const code = req.sanitize(req.body.code)
  const username = req.user.username

  Group.findOne({groupname: groupname, code: code}, (error, data) => {
    if (error) console.log(error)
    else if (data === null) {
      res.json({status: "Groupname or Code wrong."})
    //} else if (data.launched) {
    //  res.json({status: "Group launched already."})
    } else {
      if (data.members.filter(e => e.username == username).length === 1) {
        res.json({status: "already member of group"})
      } else {
        Group.findOneAndUpdate({groupname: groupname, code: code}, {$push: {members: {username: username}}}, {new: true}, (error2, data2) => {
          if (error2) console.log(error2)
          else {
            User.findOneAndUpdate({username: username}, {$push: {groups: groupname}}, {new: true}, (error3, data3) => {
              if (error3) console.log(error3)
              else {
                res.json({status: "joined group", groupname: data2.groupname})
              }
            })
          }
        })
      }
    }
  })
})

app.post("/leave", isLoggedIn, (req, res) => {
  const username = req.user.username
  const groupname = req.sanitize(req.body.groupname)

  Group.findOneAndUpdate({groupname: groupname/*, launched: false*/}, {$pull: {members: {username: username}}}, {new: true}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data === null) {
        res.json({status: "not possible", data: data})
      } else {
        User.findOneAndUpdate({username: username}, {$pull: {groups: groupname}}, (error, data) => {
          if (error) console.log(error)
          else {
            res.json({status: "deleted", data: data})
          }
        })
      }
    }
  })
})

app.post("/getwishlist", isLoggedIn, (req, res) => {
  const groupname = req.sanitize(req.body.groupname)
  const username = req.user.username
  let wishlist = []

  Group.findOne({groupname: groupname, "members.username": username}, {members: {$elemMatch: {username: username}}}, (error, data) => {
    if (error) console.log(error)
    else {
      wishlist = data.members[0].wishlist

      res.json({status: "wishlist loaded", wishlist: wishlist})
    }
  })
})

app.post("/savewishlist", isLoggedIn, (req, res) => {
  const groupname = req.sanitize(req.body.groupname)
  const username = req.user.username
  let link = req.sanitize(req.body.link)
  const myWish = Number(req.sanitize(req.body.mywish))

  if (link && link.indexOf("http") !== 0) {
    const temp = link
    link = "http://" + temp
  }

  const wishlistEntry = {
    title: req.sanitize(req.body.title),
    description: req.sanitize(req.body.description),
    link: link
  }

  let wishlist = []
  let modifiedWishlist = []

  if (myWish === -1) {
    Group.findOneAndUpdate({groupname: groupname, "members.username": username}, {$push: {"members.$.wishlist": wishlistEntry}}, {new: true, fields: {members: {$elemMatch: {username: username}}}}, (error, data) => {
      if (error) console.log(error)
      else {
        wishlist = data.members[0].wishlist
  
        res.json({status: "new wishlist entry", wishlist: wishlist})
      }
    })
  } else {
    Group.findOne({groupname: groupname, "members.username": username}, (error1, data1) => {
      if (error1) console.log(error1)
      else {
        modifiedWishlist = data1.members[0].wishlist
        modifiedWishlist[myWish] = wishlistEntry

        Group.findOneAndUpdate({groupname: groupname, "members.username": username}, {$set: {"members.$.wishlist": modifiedWishlist}}, {new: true, fields: {members: {$elemMatch: {username: username}}}}, (error2, data2) => {
          if (error2) console.log(error2)
          else {
            wishlist = data2.members[0].wishlist
      
            res.json({status: "wishlist entry edited", wishlist: wishlist})
          }
        })
      }
    })
  }
})

app.post("/deletewishlistentry", isLoggedIn, (req, res) => {
  const groupname = req.sanitize(req.body.groupname)
  const username = req.user.username
  const myWish = Number(req.sanitize(req.body.mywish))

  let wishlist = []
  let modifiedWishlist = []

  Group.findOne({groupname: groupname, "members.username": username}, {members: {$elemMatch: {username: username}}}, (error1, data1) => {
    if (error1) console.log(error1)
    else {
      modifiedWishlist = data1.members[0].wishlist
      modifiedWishlist.splice(myWish, 1)

      Group.findOneAndUpdate({groupname: groupname, "members.username": username}, {$set: {"members.$.wishlist": modifiedWishlist}}, {new: true, fields: {members: {$elemMatch: {username: username}}}}, (error2, data2) => {
        if (error2) console.log(error2)
        else {
          wishlist = data2.members[0].wishlist
    
          res.json({status: "wishlist entry deleted", wishlist: wishlist})
        }
      })
    }
  })
})

app.post("/partner", isLoggedIn, (req, res) => {
  const groupname = req.sanitize(req.body.groupname)
  const username = req.user.username
  let partner = ""
  let partnerwishlist = []

  Group.findOne({groupname: groupname, launched: true}, {members: {$elemMatch: {username: username}}}, (error1, data1) => {
    if (error1) console.log(error1)
    else if (data1 === null) {
      res.json({status: "Group has not started yet."})
    } else if (data1.members[0].partner) {
      partner = data1.members[0].partner

      Group.findOne({groupname: groupname}, {members: {$elemMatch: {username: partner}}}, (error2, data2) => {
        if (error2) console.log(error2)
        else {
          partnerwishlist = data2.members[0].wishlist

          res.json({partner: partner, partnerwishlist: partnerwishlist})
        }
      })
    } else {
      res.json({status: "No partner yet."})
    }
  })
})

app.post("/group", isLoggedIn, (req, res) => {
  const username = req.user.username
  const groupname = req.sanitize(req.body.groupname)
  let members = []

  Group.findOne({groupname: groupname, "members.username": username}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data.members) {
        data.members.forEach(e => members.push(e.username))
        
        if (username === data.owner) {
          res.json({groupname: data.groupname, owner: data.owner, members: members, launched: data.launched, code: data.code})
        } else {
          res.json({groupname: data.groupname, owner: data.owner, members: members, launched: data.launched})
        }
      } else {
        if (username === data.owner) {
          res.json({groupname: data.groupname, owner: data.owner, members: [], launched: data.launched, code: code})
        } else {
          res.json({groupname: data.groupname, owner: data.owner, members: [], launched: data.launched})
        }
      }
    }
  })
})

app.get("/groups", isLoggedIn, (req, res) => {
  const username = req.user.username
  let launched = []

  User.findOne({username: username}, (error1, data1) => {
    if (error1) console.log(error)
    else {
      if (data1 !== null) {
        Group.find({"members.username": username, launched: true}, (error2, data2) => {
          data2.forEach(e => {
            if (e.launched) {
              launched.push(e.groupname)
            }
          })
  
          res.json({groups: data1.groups, groupsowner: data1.owner, groupslaunched: launched})
        })
      } else {
        res.json({groups: data1.groups, groupsowner: data1.owner})
      }
    }
  })
})

app.post("/launch", isLoggedIn, (req, res) => {
  const username = req.user.username
  const groupname = req.sanitize(req.body.groupname)
  let partners = []

  function shuffleArray(items) {
    for (let i = items.length; i-- > 1; ) {
      let j = Math.floor(Math.random() * i);
      let temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }
  }

  Group.findOne({groupname: groupname}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data === null) {
        res.json("groupname not found")
      //} else if (data.launched === true) {
      //  res.json({status: "already launched", data: data})
      } else if (data.owner === username) {
        data.members.forEach(e => {
          partners.push(e.username)
        })

        shuffleArray(partners)

        data.members.forEach((e, i) => {
          e.partner = partners[i]
        })

        Group.findOneAndUpdate({groupname: groupname}, {members: data.members, launched: true}, {new: true}, (error, data) => {
          if (error) console.log(error)
          else {
            res.json({status: "launched group now", launched: data.launched})
          }
        })
      } else {
        res.json({status: "active user is not the owner"})
      }
    }
  })
})

app.post("/deletegroup", isLoggedIn, (req, res) => {
  const groupname = req.sanitize(req.body.groupname)
  const username = req.user.username
  let members = []
  let owner = ""

  Group.findOneAndDelete({groupname: groupname, owner: username}, (error, data) => {
    if (error) console.log(error)
    else {
      if (data !== null) {
        members = data.members
        owner = data.owner

        User.findOneAndUpdate({username: owner}, {$pull: {owner: groupname}}, {new: true}, (error, data) => {
          if (error) console.log(error)
          else {
            members.forEach(e => {
              User.findOneAndUpdate({username: e.username}, {$pull: {groups: groupname}}, {new: true}, (error, data) => {
                if (error) console.log(error)
                else {
                }
              })
            })
            res.json({status: "group deleted"})
          }
        })
      }
    }
  })
})

app.post("/removemember", isLoggedIn, (req, res) => {
  const member = req.sanitize(req.body.member)
  const groupname = req.sanitize(req.body.groupname)
  const username = req.user.username
  let members = []

  if (member === username) {
    res.json({status: "The owner cannot leave this group."})
  } else {
    Group.findOneAndUpdate({groupname: groupname, owner: username}, {$pull: {members: {username: member}}}, {new: true}, (error1, data1) => {
      if (error1) console.log(error1)
      else {
        Group.findOneAndUpdate({groupname: groupname, owner: username, "members.partner": member}, {$set: {"members.$.partner": ""}}, (error, data) => {
          if (error) console.log(error)
        })

        User.findOneAndUpdate({username: member}, {$pull: {groups: groupname}}, {new: true}, (error2, data2) => {
          if (error2) console.log(error2)
          else {
            if (data1.members) {
              data1.members.forEach(e => members.push(e.username))
            }

            res.json({status: "member removed", members: members})
          }
        })
      }
    })
  }
})

//app.get('/*', (req, res) => {
//  res.sendFile(path.join(__dirname, "dist/secret-santa/index.html"))
//})

// SERVER
app.listen(port, () => console.log(`Server running on port ${port}!`))