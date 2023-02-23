import {
  Box,
} from "@mui/material";
import React from "react";
import SignIn from "../component/login/signin";
import Signup from "../component/login/signup";

function Login() {
  return (
    <div className="App">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "60vw",
        }}
      >
        <Signup />
        <SignIn />
      </Box>
    </div>
  );
}

export default Login;
