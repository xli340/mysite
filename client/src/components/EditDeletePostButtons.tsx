import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { Box, Button, IconButton, Link, Stack } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePostMutation] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <IconButton
        aria-label="Edit Post"
        component="a"
        href={"/edit-post/" + id.toString()}
      >
        <EditRoundedIcon />
      </IconButton>
      <IconButton
        aria-label="Delete Post"
        onClick={() => {
          deletePostMutation({
            variables: { deletePostId: id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      >
        <DeleteRoundedIcon />
      </IconButton>
    </Stack>
  );
};
