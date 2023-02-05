import { useState } from "react";

const ReplyBox = (props) => {
  const { replyingTo, originalCommentId } = props;
  const [replyText, setReplyText] = useState("");

  return (
    <form
      className="user-comment"
      id="reply-box"
      onSubmit={(event) => props.sendReply(event, originalCommentId, replyingTo, replyText)}
    >
      <textarea
        rows="4"
        cols="50"
        onChange={(e) => {
          setReplyText(e.target.value);
        }}
        value={replyText}
        placeholder="Add a comment"
      ></textarea>

      <button className="send-btn">SEND</button>
    </form>
  );
};

export default ReplyBox;
