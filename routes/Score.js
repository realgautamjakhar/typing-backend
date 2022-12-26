const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const Score = require("../Modals/Score");
const User = require("../Modals/User");
const router = express.Router();

router.post("/add", fetchUser, async (req, res) => {
  try {
    const { accuracy, score, finishedIn } = req.body;
    const newScore = new Score({
      accuracy,
      score,
      finishedIn,
      user: req.user.id,
    });
    const savedNote = await newScore.save();

    //find the highest score and update user schema
    const highestInstance = await Score.find({ user: req.user.id })
      .sort({ score: -1 })
      .limit(1);
    const { score: highestScore } = highestInstance[0];
    await User.findByIdAndUpdate(req.user.id, {
      $set: { highestScore },
    });

    //Return Response to the user

    return res.json(savedNote);
  } catch (error) {
    console.log(error);
  }
});
router.get("/fetchuserscore", fetchUser, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.id });
    return res.status(200).send(scores);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
