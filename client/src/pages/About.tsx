import { Card, CardContent, Container, Typography } from "@mui/material";
import React from "react";
import { Layout } from "../components/Layout";

const AboutMe:React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ marginTop: "16px" }}>
        <Card sx={{ maxWidth: 600 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              About me
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Hello! I am Xinya, a software engineer with a passion for web development.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default AboutMe;
