const express = require("express");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const route = require("./routes/route.js");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 3000;
const session = require("express-session");
const passport = require("passport");
const Oauth2Strategy = require("passport-google-oauth20").Strategy;
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



const Instructor = require("./Model/instructorModel.js");

 
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new Oauth2Strategy({

  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  scope: ["email", "profile"],

},async function (accessToken, refreshToken, profile, done) {
  console.log(profile,accessToken,refreshToken);
  try{
    let userEmail = profile.emails[0].value;
    // Modify email domain if it's gmail.com
    userEmail = userEmail.replace('@gmail.com', '@lectureLab.com');

    let user = await Instructor.findOne({ email: userEmail });;
    if (user) {
      return done(null, user);
    } else {
      // Hash the password
 const hashedPassword = await bcrypt.hash("Pass@123", 10);
      let user = await Instructor.create({ name: profile.displayName, email:userEmail,mobile:profile._json.mobile || "1234567890", password:hashedPassword, role: "user", isDeleted: false, isActive: true, createdAt: Date.now() });
      return done(null, user);
    }
  } catch (error) {
    return done(error);
}
  
}));



passport.serializeUser(function (user, done) {
  done(null, user);
});


passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("auth/google/callback", passport.authenticate("google", { failureRedirect: "https://lecture-lab.web.app/login", successRedirect: "https://lecture-lab.web.app/assigned-batches" }));

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
});