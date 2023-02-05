const express = require("express");
const {
  getAllComments,
  getSingleComment,
  createComment,
  deleteComment,
  updateReplies,
  deleteReply,
  updateCommentVotes,
} = require("../controllers/commentsController");

const router = express.Router();

// Get all comment, primarily for main page/
router.get("/", getAllComments);

// Get single comment
router.get("/:id", getSingleComment);

// Create a new comment
router.post("/", createComment);

// Delete a single comment
router.delete("/:id", deleteComment);

// Update the replies array
router.patch("/:id", updateReplies);

// Delete a reply
router.patch("/replies/:id", deleteReply);

// Update the score of a comment
router.patch("/commentvote/:id", updateCommentVotes);
module.exports = router;
