const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/user");

router.post('/login', (req, res, next) => {
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

router.post("/register", (req, res) => {
  const username = req.sanitize(req.body.username).toLowerCase()
  const email = req.sanitize(req.body.email).toLowerCase()
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

router.post("/logout", (req, res) => {
  req.logout()
  res.json({status: "Logged out"})
})

router.post("/loginstatus", (req, res) => {
  if (req.user) {
    res.json({username: req.user.username})
  } else {
    res.json({status: "Not logged in."})
  }
})

module.exports = router