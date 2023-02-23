import {Alert, AlertTitle, Container, FormGroup, Snackbar, TextField} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [loadingLogin, setLoadingLogin] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const navigate = useNavigate();
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  let email = React.createRef();
  let password = React.createRef();

  return (
    <Container
      sx={{
        width: "45%",
        bgcolor: "gray",
      }}
    >
      <h2>Or log in</h2>
      <FormGroup
        sx={{
          "> div, label, button": {
            marginBottom: "1em",
          },
        }}
      >
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          inputRef={email}
          required
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          variant="outlined"
          type="password"
          inputRef={password}
          required
        />
        <LoadingButton
          loading={loadingLogin}
          onClick={signin}
          variant="contained"
        >
          Log in
        </LoadingButton>
      </FormGroup>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert variant="filled" severity="error" onClose={handleClose}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );

  function signin() {
    setLoadingLogin(true);

    const id = {
      "email": email.current.value,
      "password": password.current.value,
    };
    console.log(id)

    fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      mode: "cors",
      headers: {
        // 'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
      credentials: "same-origin",
    })
      .catch((err) => {
        console.error(err);
      })
      .then(async (resp) => {
        if (resp?.status === 401) {
          setErrorMessage("Invalid Credentials");
          setOpen(true);
        } else if (resp?.status === 201) {
          navigate("/coucou2");
        } else {
          setErrorMessage(`Error ${resp?.status}, ${resp?.statusText}`);
          setOpen(true);
        }
        setLoadingLogin(false);
      });
  }
}

export default SignIn;
