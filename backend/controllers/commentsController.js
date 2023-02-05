const Comment = require("../models/commentsModel");
const mongoose = require("mongoose");
const { ObjectId } = require("bson");

// get all comments
const getAllComments = async (req, res) => {
  const comments = await Comment.find({}).sort({ createdAt: -1 }); // gets all the comments sorted in recent order
  res.status(200).json(comments);
};

const getSingleComment = async (req, res) => {
  const { id } = req.params;

  // Sees if id is valid.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such comment" });
  }

  const comment = await Comment.findById(id);

  // if the workout DNE, fire this status.
  if (!comment) {
    return res.status(404).json({ error: "No such comment" });
  }

  res.status(200).json(comment);
};

const createComment = async (req, res) => {
  const { content, username } = req.body;
  // add doc to db
  try {
    // try to create new workout
    const comment = await Comment.create({
      content,
      score: 0,
      username,
      replies: [],
    }); // wait for this to be done
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;

  // make sure it is a valid id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such comment" });
  }

  const comment = await Comment.findOneAndDelete({ _id: id });

  // if the workout DNE, fire this status.
  if (!comment) {
    return res.status(404).json({ error: "No such comment" });
  }

  res.status(200).json(comment);
};

const deleteReply = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // make sure it is a valid id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such comment" });
  }

  const comment = await Comment.findOneAndUpdate(
    { _id: id },
    { $pull: { replies: { content: content } } }
  );

  // if the workout DNE, fire this status.
  if (!comment) {
    return res.status(404).json({ error: "No such comment" });
  }

  res.status(200).json(comment);
};

const updateReplies = async (req, res) => {
  const { id } = req.params;
  const { content, username, replyingTo } = req.body;

  // make sure it is a valid id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such comment" });
  }

  const comment = await Comment.updateOne(
    { _id: id },
    {
      $push: {
        replies: {
          id: ObjectId(),
          content,
          score: 0,
          username,
          replyingTo,
          createdAt: new Date(),
        },
      },
    }
  );

  // if the workout DNE, fire this status.
  if (!comment) {
    return res.status(404).json({ error: "No such comment" });
  }

  res.status(200).json(comment);
};

const updateCommentVotes = async (req, res) => {
  const { id } = req.params;
  const { increment } = req.body;

  // make sure it is a valid id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such comment" });
  }

  const comment = await Comment.updateOne({ _id: id }, { $inc: { score: parseInt(increment) } });

  // if the workout DNE, fire this status.
  if (!comment) {
    return res.status(404).json({ error: "No such comment" });
  }

  res.status(200).json(comment);
};

// const updateReplyVotes = async (req, res) => {
//   const { id } = req.params;
//   const { increment, content } = req.body;

//   // make sure it is a valid id
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such comment" });
//   }

//   const comment = await Comment.updateOne({replies})
// };

module.exports = {
  getAllComments,
  getSingleComment,
  createComment,
  deleteComment,
  updateReplies,
  deleteReply,
  updateCommentVotes,
};
