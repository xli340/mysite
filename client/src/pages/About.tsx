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
            This website is mainly a forum for discussing and exploring technologies such as react and node.js. Post supports markdown format, and you are welcome to express your thoughts and experiences on these web development technologies here. Hope you have a great time here! 
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default AboutMe;
