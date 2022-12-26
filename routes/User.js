let dotenv = require("dotenv").config();

const express = require("express");

//User modal
const User = require("../Modals/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middlewares/fetchUser");
const JwtSign = process.env.JWT_SIGN;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate

    //User Find in database
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User Dosnt Exist",
      });
    }
    //compare password
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).send({
        success: false,
        msg: "Enter Valid Credentials",
      });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JwtSign);
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
    //Validation
    const { email, password, firstName, lastName } = req.body;
    console.log(req.body);
    //Check weather user already exist or not
    const isUserAlreadyExist = await User.findOne({ emial: req.body.email });
    //If Exist
    console.log(isUserAlreadyExist);
    if (isUserAlreadyExist) {
      return res.status(404).send({
        success: false,
        msg: "User Already Exist",
      });
    }
    //else
    //Encrypt the password
    const Epassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: Epassword,
      firstName,
      lastName,
    });
    const data = {
      user: {
        id: user.id,
      },
    };

    //JWT Token
    const authToken = jwt.sign(data, JwtSign);
    return res.status(200).send({
      success: true,
      authToken,
      msg: "User Created",
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const data = await User.find()
      .sort({ highestScore: -1 })
      .select("-password")
      .select("-email");
    console.log(data);
    return res.send(data);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
