import React from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import  { stringAvatar } from "../utils/stringAvatar"

const Home: React.FC = () => {
  const { data, loading, error, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 5, // Limit the number of posts to query
      cursor: null, // Cursor, used for pagination query, indicating from which position to start getting posts
    },
    notifyOnNetworkStatusChange: true, // Send a notification when the network status changes
  });

  // If data loading is complete and no data is returned
  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  // Define function that handles loading more posts
  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: variables?.limit, // continue to use the same post count limit
        cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt, // Use the creation time of the current last post as a new cursor
      },
      updateQuery: (prevData, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevData;
        return {
          posts: {
            __typename: prevData.posts.__typename,
            hasMore: fetchMoreResult.posts.hasMore, // Update status if there are more posts
            posts: [...prevData.posts.posts, ...fetchMoreResult.posts.posts], // Add the newly fetched post to the existing list of posts
          },
        };
      },
    });
  };

  return (
    <Layout>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Container maxWidth="sm" sx={{ marginTop: "16px" }}>
          <Grid container spacing={2}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Grid item xs={12} key={p.id}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardActionArea component="a" href={"/post/"+p.id.toString()}>
                      <CardHeader
                        avatar={
                          <Avatar
                          {...stringAvatar(p.creator.username.toUpperCase())}
                            aria-label="post"
                          >
                          </Avatar>
                        }
                        title={p.title}
                        subheader={new Date(
                          parseInt(p.createdAt)
                        ).toUTCString()}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {p.textSnippet}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <UpdootSection post={p} />
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        <EditDeletePostButtons
                          id={p.id}
                          creatorId={p.creator.id}
                        />
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      )}
      {data && data.posts.hasMore ? (
        <Button onClick={handleFetchMore}>load more</Button>
      ) : null}
    </Layout>
  );
};

export default Home;