import { CommentsContext } from "../context/CommentContext";
import { useContext } from "react";

export const useCommentsContext = () => {
  const context = useContext(CommentsContext);

  if (!context) {
    throw Error("use properly");
  }

  return context;
};
