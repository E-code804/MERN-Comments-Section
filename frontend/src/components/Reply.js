import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Reply = (props) => {
  // Replies go to the OC, socre here
  const { content, createdAt, username } = props.reply;
  const { currentUser, originalCommentId } = props;

  // send the username and content as the body

  // const [commentScore, setCommentScore] = useState(score);

  // const handleVoteClick = (e) => {
  //   if (e.target.alt === "upvote") {
  //     setCommentScore((prevScore) => prevScore + 1);
  //   } else {
  //     setCommentScore((prevScore) => prevScore - 1);
  //   }
  // };

  return (
    <div className="reply-comment">
      <div className="comment-details">
        {/* <div className="comment-votes">
          <img onClick={handleVoteClick} src="./images/icon-plus.svg" alt="upvote" />
          <h1>{commentScore}</h1>
          <img onClick={handleVoteClick} src="./images/icon-minus.svg" alt="updown" />
        </div> */}

        <div className="comment-words">
          <div className="space-writer-reply">
            <div className="comment-writer-data">
              <h3>{username}</h3>{" "}
              <p>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
            </div>

            <div className="reply">
              {currentUser === username ? (
                <div
                  className="display-delete"
                  onClick={() => props.handleDelete(originalCommentId, content, true)}
                >
                  <img src="./images/icon-delete.svg" alt="delete-btn" />
                  <h3>Delete</h3>
                </div>
              ) : (
                <div
                  className="display-reply"
                  onClick={() => props.renderReplyBox(originalCommentId, username)}
                >
                  <img src="./images/icon-reply.svg" alt="reply-btn" />
                  <h3>Reply</h3>
                </div>
              )}
            </div>
          </div>

          <p className="comment-content">
            <span className="replying-to">@{props.op}</span> {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reply;
