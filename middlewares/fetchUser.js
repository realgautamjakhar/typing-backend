let dotenv = require("dotenv").config();
var jwt = require("jsonwebtoken");
const JWTSign = process.env.JWT_SIGN;
const fetchUser = (req, res, next) => {
  //get user from the jwt token and add id to the req object

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWTSign);
    console.log(data);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

module.exports = fetchUser;
