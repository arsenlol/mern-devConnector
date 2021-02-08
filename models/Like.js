const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Like = mongoose.model("like", LikeSchema);
