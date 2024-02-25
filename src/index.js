const express = require("express");
var bodyParser = require("body-parser");

const route = require("./routes/route.js");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 3000;
const IP_ADDRESS = "localhost";
const path = require("path");

const corsOptions = {
  origin: process.env.DOMAIN,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true })
  .then(() => console.log("db running on 27017"))
  .catch((err) => console.log(err));

// app.use(multer().any())
app.use("/", route);

const fileupload = require("express-fileupload");
app.use(
  fileupload({
    debug: true,
    tempFileDirectory: path.join(__dirname, "./temp"),
    useTempFiles: true,
  })
);

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
});
