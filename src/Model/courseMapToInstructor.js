const mongoose = require("mongoose");

const courseMapToInstructorSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course"  },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor" },
    batchName: { type:String,required:true },
    date: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
})

module.exports = mongoose.model("CourseMapToInstructor", courseMapToInstructorSchema);
