const express = require("express");
const connectDb = require("./connectdb");
const PORT = 5000;
const app = express();
var cors = require("cors");

connectDb();

app.use(cors());

//Json Parse MiddleWare
app.use(express.json());

//Routes
app.use("/api/auth", require("./routes/User")); //User Route Contain Signup SignIn LogOut
app.use("/api/score", require("./routes/Score")); //Contain Add new Score, fetch all user score

app.listen(PORT, () => {
  console.log("Server running", PORT);
});
