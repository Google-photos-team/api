const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: String,
  images: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Image"
  }, // array of image_id
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  }
})

module.exports = mongoose.model('Folder', folderSchema)