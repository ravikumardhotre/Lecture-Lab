const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/courseController')
const fileUpload = require('../middleware/multer')
const validUser = require('../middleware/validateTokenHandler')
const instructorController= require('../Controllers/instructorController')

//user api 
router.post("/api/users/login", instructorController.loginUser)

//coursecontroller api 
router.post("/api/courses/addCourse",fileUpload.singleFileUpload, courseController.createcourse);
router.get("/api/courses/getAllCourses",validUser.validateToken,courseController.getAllCourses);
router.post("/api/courses/getCourseDetailsById",validUser.validateToken,courseController.getcourseDetailById)

//lecture api
router.post("/api/courses/assignBatchToCourse",validUser.validateToken,courseController.assignBatchToCourse);
router.post("/api/courses/getAllAssigned",validUser.validateToken,courseController.getAllAssigned);
router.post("/api/courses/assignBatch",validUser.validateToken,courseController.assignbatchesToInstructor);
router.post("/api/courses/getBatchByCourseId",validUser.validateToken,courseController.getBatchByCourseId);

//  instructor api
router.post("/api/instructor/register",validUser.validateToken, instructorController.instructorCreate)
router.get("/api/instructor/getAllInstructor",validUser.validateToken, instructorController.getAllInstructors)
router.post("/api/instructor/deactivateInstructor",validUser.validateToken, instructorController.deleteInstructor)

module.exports = router;