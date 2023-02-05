import { useState, useEffect } from "react";
import { useCommentsContext } from "../hooks/useCommentsContext";

// Components
import Comment from "../components/Comment";
import Reply from "../components/Reply";
import ReplyBox from "../components/ReplyBox";

function Home() {
  // Display States
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEnterUser, setShowEnterUser] = useState(true);

  const [currentUser, setCurrentUser] = useState("");
  const [error, setError] = useState(null);
  const [userToReply, setUserToReply] = useState("");
  const { comments, dispatch } = useCommentsContext();
  const [userComment, setUserComment] = useState("");
  const [currentCommentData, setCurrentCommentData] = useState({
    id: 0, // this ID belongs to the reply's OC
    content: "",
    isReply: false,
  });

  const fetchWorkouts = async () => {
    const response = await fetch("http://localhost:4000/comments/");
    const json = await response.json();

    if (response.ok) {
      // set the comments here
      dispatch({ type: "SET_COMMENTS", payload: json });
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const toggleDeleteScreen = () => {
    setShowConfirmDelete((prevValue) => !prevValue);
  };

  const deleteComment = async () => {
    const { id, isReply } = currentCommentData;
    if (!isReply) {
      const response = await fetch(`http://localhost:4000/comments/${id}`, {
        method: "DELETE",
      });
      // doc that was deleted
      const json = await response.json();

      // ok response
      if (response.ok) {
        console.log("Successfully deleted " + json);
        // dispatch({ type: "DELETE_WORKOUT", payload: json });
        fetchWorkouts();
      }
    } else {
      const response = await fetch(
        `http://localhost:4000/comments/replies/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(currentCommentData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();

      // see if response was ok
      if (!response.ok) {
        setError(json.error);
      }
      if (response.ok) {
        setError(null);
        console.log("Reply deleted " + json);
        fetchWorkouts();
      }
    }
    toggleDeleteScreen();
  };

  // flag for if a reply or not
  const handleDelete = (id, content, isReply) => {
    setCurrentCommentData({ id, content, isReply });
    toggleDeleteScreen();
  };

  const generateComment = (newContent, replyingTo) => {
    if (replyingTo === "") {
      return {
        content: newContent,
        score: 0,
        username: currentUser,
        replies: [],
      };
    } else {
      return {
        content: newContent,
        score: 0,
        replyingTo: replyingTo,
        username: currentUser,
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add this new comment to the comments

    const comment = generateComment(userComment, "");

    const response = await fetch("http://localhost:4000/comments", {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    // see if response was ok
    if (!response.ok) {
      setError("error");
    }
    if (response.ok) {
      setUserComment("");
      setError(null);
      console.log("New comment added ");
      dispatch({ type: "CREATE_COMMENT", payload: json });
    }
  };

  const renderReplyBox = (id, fromReplyUsername) => {
    const dispatchObj = {
      boxId: id,
      replyUsername: fromReplyUsername,
      userReplyFunction: setUserToReply,
    };
    dispatch({ type: "RENDER_REPLY", payload: dispatchObj });
  };

  // updating the replies array
  const sendReply = async (event, id, replyingTo, content) => {
    event.preventDefault();

    dispatch({ type: "REMOVE_REPLYBOX", payload: id });

    const reply = generateComment(content, replyingTo);

    const response = await fetch(`http://localhost:4000/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(reply),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    // see if response was ok
    if (!response) {
      setError("error");
    }
    if (response) {
      setError(null);
      console.log("New reply added " + json);
      fetchWorkouts();
    }
  };

  return (
    <div className="App">
      {showEnterUser && (
        <div className="confirm-delete">
          <div className="delete-container">
            <h1>Please enter your username</h1>
            <input
              onChange={(e) => {
                setCurrentUser(e.target.value);
              }}
              placeholder="Enter username"
            />
            <button id="enter-user-btn" onClick={() => setShowEnterUser(false)}>
              Enter
            </button>
          </div>
        </div>
      )}
      {!showEnterUser &&
        comments.map((comment) => {
          return (
            <div key={comment._id} className="comment-replies">
              <Comment
                key={comment._id}
                id={comment._id}
                handleDelete={handleDelete}
                renderReplyBox={renderReplyBox}
                currentUser={currentUser}
                comment={comment}
              />
              {comment.replies.map((reply) => {
                if (reply === "replybox") {
                  return (
                    <ReplyBox
                      key={comment._id}
                      sendReply={sendReply}
                      replyingTo={userToReply}
                      originalCommentId={comment._id}
                    />
                  );
                } else {
                  return (
                    <Reply
                      key={reply.id}
                      id={reply.id}
                      originalCommentId={comment._id}
                      handleDelete={handleDelete}
                      renderReplyBox={renderReplyBox}
                      currentUser={currentUser}
                      op={reply.replyingTo}
                      reply={reply}
                    />
                  );
                }
              })}
            </div>
          );
        })}

      <form className="user-comment" onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          onChange={(e) => {
            setUserComment(e.target.value);
          }}
          value={userComment}
          placeholder="Add a comment"
        ></textarea>

        <button className="send-btn">SEND</button>
      </form>

      {error && error}

      {showConfirmDelete && (
        <div className="confirm-delete">
          <div className="delete-container">
            <h1>Delete Comment</h1>
            <p>
              Are you sure you want to delete this comment? It cannot be undone
            </p>
            <div className="confirm-delete-btns">
              <button onClick={toggleDeleteScreen} id="cancel">
                CANCEL
              </button>
              <button onClick={deleteComment} id="delete">
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
