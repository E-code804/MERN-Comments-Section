const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
    },
    username: {
      type: String,
    },
    replyingTo: {
      type: String,
    },
    replies: {
      type: Array,
    },
  },
  { timestamps: true } // gives time when smth was created
);

module.exports = mongoose.model("Comment", commentsSchema);
