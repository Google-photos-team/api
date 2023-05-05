const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String, // hashed password
  avatar: String, // base64
  folders: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Folder"
  }, // array of folder_id
  images: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Image"
  } // array of image_id
})

module.exports = mongoose.model('User', userSchema)