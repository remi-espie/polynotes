import { Container, FormGroup, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [loadingLogin, setLoadingLogin] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  let navigate = useNavigate();
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
          ref={email}
          required
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          variant="outlined"
          type="password"
          ref={password}
          required
        />
        <LoadingButton loading={loadingLogin} variant="contained">
          Log in
        </LoadingButton>
      </FormGroup>
    </Container>
  );
}

export default SignIn