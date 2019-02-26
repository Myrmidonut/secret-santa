const express = require("express")
const router = express.Router()
const Group = require("../models/group")

function isLoggedIn(req, res, next) {
  if (req.user) {
    return next()
  } else {
    res.sendFile(path.join(__dirname, "dist/index.html"))
  }
}

router.post("/getwishlist", isLoggedIn, (req, res) => {
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

router.post("/savewishlist", isLoggedIn, (req, res) => {
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

router.post("/deletewishlistentry", isLoggedIn, (req, res) => {
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

module.exports = router