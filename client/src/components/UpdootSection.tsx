import React, { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";
import { IconButton, Stack, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number, // The value of the vote, which may be positive or negative
  postId: number, // ID of the post
  cache: ApolloCache<VoteMutation> // Apollo cache object
) => {
  // read data for a specific post from cache
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId, // Build a cache key based on the post ID
    // Define a GraphQL fragment for reading specific fields of a post
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  // If the data is read from the cache
  if (data) {
    // If the previous voting status is the same as the current voting value, return directly without performing subsequent operations
    if (data.voteStatus === value) {
      return;
    }
    // Calculate the new number of likes
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    // Update the post data in the cache
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value }, // updated post data
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <IconButton
        color={post.voteStatus === 1 ? "success" : undefined}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("updoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        aria-label="updoot post"
      >
        <ThumbUpOffAltIcon />
      </IconButton>
      <Typography>{post.points}</Typography>
      <IconButton
        color={post.voteStatus === -1 ? "error" : undefined}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downdoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        aria-label="downdoot post"
      >
        <ThumbDownOffAltIcon />
      </IconButton>
    </Stack>
  );
};
