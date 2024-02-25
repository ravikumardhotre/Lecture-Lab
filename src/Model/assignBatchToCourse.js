const mongoose = require("mongoose");

const assignBatchToCourseSchema = new mongoose.Schema({
    batchName: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
})

module.exports = mongoose.model("AssignBatchToCourse", assignBatchToCourseSchema)