import logo from "../../assets/logo.png";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useState } from "react";
import {Alert, Autocomplete, Collapse, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userType, workspaceType } from "../../types";

function SearchHeader(props: { user: userType; workspaces: workspaceType[] }) {
  const [open, setOpen] = useState(props.user.validated);



  const list = props.workspaces.map((workspace) => {
    return {
      label: workspace.name,
        id: workspace._id,
    }
  })

  return (
    <Box sx={{ top: 0, width: "100%", position: "absolute" }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton sx={{marginBottom: 0}}>
            <Link to={"/home"}>
              <img src={logo} alt="logo" width={40} height={40} />
            </Link>
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
            <Autocomplete
                sx={{ flexGrow: 20, "label": {
                    display: "flex",
                    alignItems: "center",
                  }
                }}
              options={list}
              renderInput={(params) => <TextField {...params} label={<>
                <SearchIcon />
                Search
              </>
              } />}
            >
            </Autocomplete>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton  sx={{marginBottom: 0}}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <Link to={"/profile"}>
                <AccountCircle sx={{ color: "white" }} />
              </Link>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Collapse
        in={!open}
        sx={{
          width: "100%",
          position: "absolute",
          top: "4em",
          zIndex: "10000",
        }}
      >
        <Alert
          severity={"error"}
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(true);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Your account is not validated yet, please check your email !
        </Alert>
      </Collapse>
    </Box>
  );
}

export default SearchHeader;