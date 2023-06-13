import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { Wrapper } from "../components/Wrapper";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        // form initial value
        initialValues={{ email: "", username: "", password: "" }}
        // Handling function when submitting the form
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            // The handler for updating the cache
            // The function of the update section is to update the "MeQuery" query
            // result in the Apollo cache to ensure that the status of the application is updated immediately
            // after the user's registration is successful
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
            },
          });
          // When registration fails, set the error message to the form
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          }
          // When the registration is successful, jump to the home page
          else if (response.data?.register.user) {
            navigate("/");
          }
        }}
      >
          <Form>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
            </Grid>
            <Grid item xs={12}>
              <InputField name="email" placeholder="email" label="Email" />
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
                register
              </Button>
            </Grid>
            </Grid>
          </Form>
      </Formik>
    </Wrapper>
  );
};

export default Register;
