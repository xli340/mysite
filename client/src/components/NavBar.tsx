import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import Grid from "@mui/material/Grid";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logoutMutation] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;

  // data is loading
  if (loading || isServer()) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Link color="inherit" underline="none" href="/login">
            LOGIN
          </Link>
        </Grid>
        <Grid item>
          <Link color="inherit" underline="none" href="/register">
            REGISTER
          </Link>
        </Grid>
      </Grid>
    );
    // user is logged in
  } else {
    body = (
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography color="inherit">{data.me.username}</Typography>
        </Grid>
        <Grid item>
          <Button
            color="inherit"
            onClick={async () => {
              await logoutMutation();
              window.location.reload();
            }}
          >
            logout
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            XINYA
          </Typography>
          <Box>{body}</Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
