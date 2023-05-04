const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  }, // from user,
  token: String
})

module.exports = mongoose.model('Token', tokenSchema)