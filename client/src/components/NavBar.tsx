import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import Grid from "@mui/material/Grid";
import AdbIcon from "@mui/icons-material/Adb";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import { stringAvatar } from "../utils/stringAvatar";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar {...stringAvatar(data?.me.username.toUpperCase())} />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem component="a" href="/create-post">
            CreatePost
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await logoutMutation();
              window.location.reload();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SentimentSatisfiedAltIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Mysite
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              component="a"
              href="/"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              HOME
            </Button>
            <Button
              component="a"
              href="/about"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              ABOUT
            </Button>
            <Button
              component="a"
              href="/cv"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              CV
            </Button>
          </Box>

          <Box>{body}</Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
