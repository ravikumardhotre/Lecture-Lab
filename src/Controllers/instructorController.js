const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Instructor = require("../Model/instructorModel");

const instructorCreate = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    // Check if the email already exists
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const instructor = new Instructor({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
    console.log(instructor);

    await instructor.save();
    res
      .status(201)
      .json({ message: "Instructor created successfully", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).send({ status: false, message: `Email is required` });
      return;
    }

    if (!password) {
      res.status(400).send({ status: false, message: `Password is required` });
      return;
    }
    const user = await Instructor.findOne({ email: email });

    if (!user) {
      res
        .status(401)
        .send({ status: false, message: `Invalid login credentials` });
      return;
    }

    let hashedPassword = user.password;
    const encryptedPassword = await bcrypt.compare(password, hashedPassword); 

    if (!encryptedPassword)
      return res
        .status(401)
        .send({
          status: false,
          message: `Login failed! password is incorrect.`,
        });

    const token = jwt.sign(
      {
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 1800,
      },
      process.env.JWT_SECRET_KEY
    );

    res.header("token", token);
    res
      .status(200)
      .send({
        status: true,
        message: `user login successfull`,
        token: token,
        userDetails: user,
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({
      role: "user",
      isActive: true,
      isDeleted: false,
    });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteInstructor = async (req, res) => {
  try {
    const instructorId = req.body.instructorId;

    // Check if the instructor exists
    const instructor = await Instructor.findOneAndUpdate(
      { _id: instructorId },
      { isDeleted: true },
      { new: true }
    );
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Delete the instructor

    res.json({ message: "Instructor deleted successfully", status: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  instructorCreate,
  loginUser,
  getAllInstructors,
  deleteInstructor,
};
