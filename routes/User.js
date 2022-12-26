let dotenv = require("dotenv").config();

const express = require("express");

//User modal
const User = require("../Modals/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middlewares/fetchUser");
const { isValidEmail, isValidPassword } = require("../utils/validators");
const JwtSign = process.env.JWT_SIGN;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate
    if (!isValidEmail(email)) {
      return res.send({
        success: false,
        msg: "Please Enter a valid Emial",
      });
    }
    //password validation
    if (!isValidPassword(password)) {
      return res.send({
        success: false,
        msg: "Please Enter a valid Password with Atleast 6 Char with atleast one Digit and one Special symbol",
      });
    }

    //User Find in database
    const user = await User.findOne({ email: email });

    //If user dosn't exist send this response
    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User Dosnt Exist",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    //If passwords are not same send this response
    if (!comparePassword) {
      return res.status(400).send({
        success: false,
        msg: "Enter Valid Credentials",
      });
    }

    //Payload for jwt token
    const data = {
      user: {
        id: user.id,
      },
    };

    //Auth token generation
    const authToken = jwt.sign(data, JwtSign);

    //Sending final response to the user
    return res.status(200).send({
      success: true,
      authToken,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    //validation of email and password with minimum of 8 char
    if (!isValidEmail(email)) {
      return res.send({
        success: false,
        msg: "Please Enter a valid Emial",
      });
    }
    if (!isValidPassword(password)) {
      return res.send({
        success: false,
        msg: "Please Enter a valid Password with Atleast 6 Char with atleast one Digit and one Special symbol",
      });
    }

    //Check weather user already exist or not
    const isUserAlreadyExist = await User.findOne({ email: req.body.email });
    //If Exist
    if (isUserAlreadyExist) {
      return res.status(404).send({
        success: false,
        msg: "User Already Exist",
      });
    }
    //Encrypt the password
    const Epassword = await bcrypt.hash(password, 10);

    //creating a new user
    const user = await User.create({
      email,
      password: Epassword,
      firstName,
      lastName,
    });

    //payload for jwt
    const data = {
      user: {
        id: user.id,
      },
    };

    //JWT Token
    const authToken = jwt.sign(data, JwtSign);

    //final response
    return res.status(200).send({
      success: true,
      authToken,
      msg: "User Created",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Some Internal Server Error");
  }
});

router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Some Internal Server Error");
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const data = await User.find()
      .sort({ highestScore: -1 })
      .select("-password")
      .select("-email");
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Some Internal Server Error");
  }
});
module.exports = router;
