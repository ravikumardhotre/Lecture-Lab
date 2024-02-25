const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  image: { public_id: String, url: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

module.exports = mongoose.model("Course", courseSchema);
