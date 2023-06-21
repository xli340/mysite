import React from "react";
import { Layout } from "../../components/Layout";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Box, Typography, Paper, Container, Grid } from "@mui/material";
import ReactMarkdown from "react-markdown";
import "./Single-post.css";

const SinglePost: React.FC= () => {
  const { data, error, loading } = useGetPostFromUrl();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ marginTop: "16px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center" variant="h4">
              {data.post.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: "16px" }}>
              <div className="readme-container">
                <ReactMarkdown className="Readme">
                  {data.post.text}
                </ReactMarkdown>
              </div>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <EditDeletePostButtons
              id={data.post.id}
              creatorId={data.post.creator.id}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default SinglePost;
