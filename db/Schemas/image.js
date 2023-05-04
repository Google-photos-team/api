const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  image: String, // base64
  name: String,
  tags: [String],
  folder_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Folder"
  }
})

module.exports = mongoose.model('Image', imageSchema)