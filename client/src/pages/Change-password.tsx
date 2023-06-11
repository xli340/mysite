import React, { useState } from "react";
import { Wrapper } from "../components/Wrapper";
import { Formik, Form } from "formik";
import { Link, Button, Grid, Box, Typography } from "@mui/material";
import { toErrorMap } from "../utils/toErrorMap";
import { InputField } from "../components/InputField";
import {
  useChangePasswordMutation,
  MeDocument,
  MeQuery,
} from "../generated/graphql";
import { useNavigate, useParams } from "react-router-dom";

const ChangePassword: React.FC<{}> = () => {
  const token = useParams().token;
  const navigate = useNavigate();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: typeof token === "string" ? token : "",
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // worked
            navigate("/");
          }
        }}
      >
        <Form>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Grid>
            {tokenError ? (
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <Typography>{tokenError}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Link color="inherit" href="/forgot-password">
                    click here to get a new one
                  </Link>
                </Grid>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                change password
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
