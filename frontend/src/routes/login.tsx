import { Box } from "@mui/material";
import React, { useEffect } from "react";
import SignIn from "../component/user/signin";
import Signup from "../component/user/signup";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  async function isLoggedIn() {
    fetch("/api/user").then((resp) => {
      if (resp.status === 200) {
        navigate("/home");
      }
    });
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <Box
      className="App"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
            width: { xs: "80vw", md: "60vw"},
          alignItems: "center",
            flexDirection: { xs: "column", md: "row"}
        }}
      >
        <Signup />
        <SignIn />
      </Box>
    </Box>
  );
}

export default Login;