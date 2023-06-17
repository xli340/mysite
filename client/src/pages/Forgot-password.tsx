import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Link, Button, Grid, Box, Container } from "@mui/material";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
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
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        <Form>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                forgot password
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
