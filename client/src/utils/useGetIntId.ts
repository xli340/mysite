import { useParams } from "react-router-dom";

export const useGetIntId = () => {
  const postId = useParams().postId;
  const intId = typeof postId === "string" ? parseInt(postId) : -1;

  return intId;
};
