import React from "react";
import { Grid } from "@mui/material";
import { NavBar } from "./NavBar";
import { Wrapper } from "./Wrapper";

interface LayoutProps {
  children: any;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NavBar />
      </Grid>
      <Grid item xs={12}>
        <Wrapper>{children}</Wrapper>
      </Grid>
    </Grid>
  );
};
