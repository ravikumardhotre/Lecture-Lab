const courseSchema = require('../Model/courseModel')  
const courseMapToInstructorSchema = require("../Model/courseMapToInstructor");
const assignBatchToCourseSchema = require("../Model/assignBatchToCourse");
var ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require("cloudinary").v2;
const { getDataUri } = require("../utils/dataUri");


const createcourse = async (req, res) => {
  try {
    let file = req.file;

    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.uploader.upload(
      fileUri.content,
      {
        folder: "courses",
      },
      (err, result) => {
        if (err) {
          console.log(err);
        }
        return result;
      }
    );

    let requestBody = req.body;
    let { name, level, description } = requestBody;

    let data = {
      name: requestBody.name,
      level: requestBody.level,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },

      description: requestBody.description,
    };

    let newcourse = await courseSchema.create(data);

    if (newcourse) {
      return res.status(200).send({
        status: true,
        message: "course created successfully",
        data: newcourse,
      });
    } else {
      return res
        .status(200)
        .send({ status: false, message: "course not created" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error.message, data: null });
  }
};

const getcourseDetailById = async (req, res) => {
  try {
    const { id } = req.body;

    let getcourse = await courseSchema.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "course_imgs",
          localField: "_id",
          foreignField: "course_id",
          as: "course_imgs",
        },
      },
    ]);

    if (getcourse) {
      return res.status(200).send({
        status: true,
        message: "get course details succesfully",
        data: getcourse,
      });
    } else {
      return res
        .status(200)
        .send({ status: false, message: "data not found", data: null });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const course = await courseSchema.find({ isActive: true });
    res.status(200).send({
      status: true,
      message: "All Courses get successfully",
      data: course,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};



const assignbatchesToInstructor = async (req, res) => {
  try {
    const { courseId, instructorId, batchName, date } = req.body;

    const alreadyAssigned = await courseMapToInstructorSchema.findOne({
      date: date,
      instructorId: instructorId,
    });
    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "course already assigned on this date" });
    }

    // let batchData = JSON.parse(courseId);

    // for (let i = 0; i < batchData.length; i++) {
    //   const course = batchData[i];
    {
      let assignCourse = await courseMapToInstructorSchema.create({
        courseId: courseId,
        instructorId: instructorId,
        batchName: batchName,
        date: date,
      });
    }

    res
      .status(201)
      .json({ message: "Lecture assigned successfully", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const assignBatchToCourse = async (req, res) => {
  try {
    const { courseId, batchName } = req.body;

    let batchData = JSON.parse(batchName);

    for (let i = 0; i < batchData.length; i++) {
      const batch = batchData[i];
      let assignBatch = await assignBatchToCourseSchema.create({
        courseId: courseId,
        batchName: batch,
      });
    }

    res
      .status(201)
      .json({
        message: "batches  assigned to course successfully",
        status: true,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAssigned = async (req, res) => {
  const { instructorId } = req.body;

  try {
    const assignedBatches = await courseMapToInstructorSchema.aggregate([
      {$match:{instructorId:new  ObjectId(instructorId)}},
      {$lookup:{
          from:"courses",
          localField:"courseId",
          foreignField:"_id",
          as:"course"
      }},
    
      { "$project": {
          "course" : 1,
          "batchName":1,
          "date":1
          
         
      }}
  ])
    res.json(assignedBatches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBatchByCourseId = async (req, res) => {
  try {
    const { courseId } = req.body;

const getBatchByCourseId = await assignBatchToCourseSchema.find({courseId:courseId});
if (!getBatchByCourseId) {
  return res.status(400).json({ message: "Batch not found" });
}
res.send(getBatchByCourseId)
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
}

module.exports = {
  createcourse,
  getcourseDetailById,
  getAllCourses,
  assignbatchesToInstructor,
  assignBatchToCourse,
  getAllAssigned,
  getBatchByCourseId,
};
