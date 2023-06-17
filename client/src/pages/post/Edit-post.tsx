import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { useGetIntId } from "../../utils/useGetIntId";
import { useNavigate } from "react-router";
import { Box, Button, Container, Grid, TextField } from "@mui/material";

const EditPost:React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      postId: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Formik
            initialValues={{ title: data.post.title, text: data.post.text }}
            onSubmit={async (values) => {
              await updatePost({
                variables: { updatePostId: intId, ...values },
              });
              navigate(-1);
            }}
          >
            <Form>
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <InputField name="title" placeholder="title" label="Title" />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    name="text"
                    placeholder="text..."
                    label="Body"
                    textarea
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">
                    update post
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Container>
    </Layout>
  );
};

export default EditPost;
