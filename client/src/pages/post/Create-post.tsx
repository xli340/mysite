import { Box, Button, Container, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { useCreatePostMutation } from "../../generated/graphql";
import { useIsAuth } from "../../utils/useIsAuth";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
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
            initialValues={{ title: "", text: "" }}
            onSubmit={async (values) => {
              const { errors } = await createPost({
                variables: { input: values },
                update: (cache) => {
                  cache.evict({ fieldName: "posts:{}" });
                },
              });
              if (!errors) {
                navigate("/");
              }
            }}
          >
            <Form>
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <InputField name="title" placeholder="title" label="Title" />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    textarea
                    name="text"
                    placeholder="text..."
                    label="Body"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">
                    create post
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

export default CreatePost;
