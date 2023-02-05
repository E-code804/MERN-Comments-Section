import { createContext, useReducer } from "react";

export const CommentsContext = createContext();

export const commentsReducer = (state, action) => {
  switch (action.type) {
    case "SET_COMMENTS":
      return { comments: action.payload };
    case "CREATE_COMMENT":
      return {
        comments: [action.payload, ...state.comments],
      };
    case "RENDER_REPLY":
      return {
        comments: state.comments.map((comment) => {
          if (comment._id === action.payload.boxId) {
            const newReplies = comment.replies;
            newReplies.push("replybox");
            action.payload.userReplyFunction(
              action.payload.replyUsername ? action.payload.replyUsername : comment.username
            );
            return { ...comment, replies: newReplies };
          }
          return comment;
        }),
      };
    case "REMOVE_REPLYBOX":
      return {
        comments: state.comments.map((comment) => {
          if (comment._id === action.payload.id) {
            const replies = comment.replies;
            replies.pop();
            return { ...comment, replies: replies };
          }
          return comment;
        }),
      };
    default:
      return state;
  }
};

export const CommentsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentsReducer, {
    comments: null,
  });
  return (
    <CommentsContext.Provider value={{ ...state, dispatch }}>{children}</CommentsContext.Provider>
  );
};
