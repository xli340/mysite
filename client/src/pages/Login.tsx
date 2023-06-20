import React from "react";
import { Formik, Form } from "formik";
import { Link, Button, Grid, Box, Container, TextField } from "@mui/material";
import { InputField } from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useNavigate } from "react-router";

const Login: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
      >
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({
              variables: values,
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.login.user,
                  },
                });
                cache.evict({ fieldName: "posts:{}" });
              },
            });
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              navigate("/");
            }
          }}
        >
          <Form>
            <Grid container rowSpacing={2}>
              <Grid item xs={12}>
                <InputField
                  name="usernameOrEmail"
                  placeholder="username or email"
                  label="Username or Email"
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained">
                  login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Link color="inherit" underline="none" href="/forgot-password">
                  forgot password?
                </Link>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
