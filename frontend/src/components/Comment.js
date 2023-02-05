// import { useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useCommentsContext } from "../hooks/useCommentsContext";

const Comment = (props) => {
  const { dispatch } = useCommentsContext();
  const { content, createdAt, score, username } = props.comment;
  const { currentUser, id } = props;

  const fetchWorkouts = async () => {
    const response = await fetch("http://localhost:4000/comments/");
    const json = await response.json();

    if (response.ok) {
      // set the comments here
      dispatch({ type: "SET_COMMENTS", payload: json });
    }
  };

  const updateScore = async (num) => {
    const response = await fetch(
      `http://localhost:4000/comments/commentvote/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ increment: num }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();

    // see if response was ok
    if (!response.ok) {
      console.log(json.error);
    }
    if (response.ok) {
      console.log("Updated comment vote " + json);
      fetchWorkouts();
    }
  };

  const handleVoteClick = async (e) => {
    if (e.target.alt === "upvote") {
      updateScore(1);
    } else {
      updateScore(-1);
    }
  };

  return (
    <div className="comment">
      <div className="comment-details">
        <div className="comment-votes">
          <img
            onClick={handleVoteClick}
            src="./images/icon-plus.svg"
            alt="upvote"
          />
          <h1>{score}</h1>
          <img
            onClick={handleVoteClick}
            src="./images/icon-minus.svg"
            alt="updown"
          />
        </div>

        <div className="comment-words">
          <div className="space-writer-reply">
            <div className="comment-writer-data">
              <h3>{username}</h3>{" "}
              <p>
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>

            <div className="reply">
              {currentUser === username ? (
                <div
                  className="display-delete"
                  onClick={() => props.handleDelete(id, false)}
                >
                  <img src="./images/icon-delete.svg" alt="delete-btn" />
                  <h3>Delete</h3>
                </div>
              ) : (
                <div
                  className="display-reply"
                  onClick={() => props.renderReplyBox(id)}
                >
                  <img src="./images/icon-reply.svg" alt="reply-btn" />
                  <h3>Reply</h3>
                </div>
              )}
            </div>
          </div>

          <p className="comment-content">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
