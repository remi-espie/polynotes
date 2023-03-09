import {
  Alert,
  AlertTitle,
  Container,
  Snackbar,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [loadingLogin, setLoadingLogin] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [submit, setSubmit] = React.useState(false);

  useEffect(() => {
    function signin() {
      setLoadingLogin(true);

      const id = {
        email: email.current?.value,
        password: password.current?.value,
      };

      fetch("/api/auth/login", {
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
              navigate("/home");
            } else {
              setErrorMessage(
                  `Error ${resp?.status}, ${await resp
                      ?.json()
                      .then((json) => json.message)}`
              );
              setOpen(true);
            }
            setLoadingLogin(false);
            setSubmit(false)
          });
    }
    if (submit) {
      signin();
    }
  }, [submit])

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

  function signIn(){
    setSubmit(true)
  }

  let email = React.createRef<React.InputHTMLAttributes<string>>();
  let password = React.createRef<React.InputHTMLAttributes<string>>();

  return (
    <div className={"login"}>
      <Container>
        <h2>Or log in</h2>
        <form className={"customForm"}
          onSubmit={(e) => {
            e.preventDefault();
            signIn();
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
            type={"submit"}
            loading={loadingLogin}
            onClick={signIn}
            variant="contained"
          >
            Log in
          </LoadingButton>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert variant="filled" severity="error" onClose={handleClose}>
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default SignIn;