const mongoose              = require("mongoose");

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

module.exports = mongoose.model("Group", GroupSchema)