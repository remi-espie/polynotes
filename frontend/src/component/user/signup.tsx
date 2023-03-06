import {
  Alert,
  AlertTitle,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Snackbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import Tos from "../tos";

function SignUp() {
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

  const [loadingCreate, setLoadingCreate] = React.useState(false);

  let email = React.createRef<HTMLInputElement>();
  let nickname = React.createRef<HTMLInputElement>();
  let password1 = React.createRef<HTMLInputElement>();
  let password2 = React.createRef<HTMLInputElement>();
  let over13 = React.createRef<HTMLInputElement>();
  let tos = React.createRef<HTMLInputElement>();

  return (
    <div className={"login"}>
      <Container className={"login"}>
        <h2>Create an account</h2>
        <FormGroup
          sx={{
            "> div, label, button": {
              marginBottom: "1em",
            },
          }}
        >
          <TextField
            id="outlined-basic"
            label="Nickname (over 3 characters)"
            variant="outlined"
            required
            inputRef={nickname}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            required
            inputRef={email}
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            variant="outlined"
            type="password"
            required
            inputRef={password1}
          />
          <TextField
            id="outlined-password-input"
            label="Confirm password"
            variant="outlined"
            type="password"
            required
            inputRef={password2}
          />
          <FormControlLabel
            control={<Checkbox required/>}
            label="I'm over 13 years old *"
            inputRef={over13}
          />
          <FormControlLabel
            control={<Checkbox required/>}
            label={
              <>
                <span>I accept the </span>
                <Tos />
                <span> *</span>
              </>
            }
            inputRef={tos}
          />
          <LoadingButton
            type={"submit"}
            loading={loadingCreate}
            onClick={createAccount}
            variant="contained"
          >
            Create an account
          </LoadingButton>
        </FormGroup>
      </Container>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert variant="filled" severity="error" onClose={handleClose}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );

  function createAccount() {
    setLoadingCreate(true);

    if (!testData()) {
      setLoadingCreate(false);
      return;
    }
    const id = {
      email: email.current!.value as string,
      nickname: nickname.current!.value as string,
      password: password1.current!.value as string,
    };

    fetch("/api/user", {
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
          setLoadingCreate(false);
          await signin(id);
        } else {
          setErrorMessage(`Error ${resp?.status}, ${resp?.statusText}`);
          setOpen(true);
        }
        setLoadingCreate(false);
      });
  }

  function testData() {
    if ((nickname.current?.value as string).length < 3) {
      setErrorMessage("Nickname length is too short (minimum 3 characters)");
      setOpen(true);
      return false;
    }
    const regexMail = new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    if (!regexMail.test(email.current?.value as string)) {
      setErrorMessage("Please enter a valid email address");
      setOpen(true);
      return false;
    }
    if (password1.current?.value !== password2.current?.value) {
      setErrorMessage("Passwords are not the same");
      setOpen(true);
      return false;
    }
    const regexPassword = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    if (!regexPassword.test(password1.current?.value as string)) {
      setErrorMessage(
        "Please enter a password with one uppercase, one lowercase, one number and one symbol, minimum of 8 character"
      );
      setOpen(true);
      return false;
    }
    if (!over13.current?.checked) {
      setErrorMessage("You need to be over 13 to create an account");
      setOpen(true);
      return false;
    }
    if (!tos.current?.checked) {
      setErrorMessage("You need to read and accept Terms of Service");
      setOpen(true);
      return false;
    }
    return true;
  }

  function signin(id: { nickname: string; email: string; password: string }) {
    id.nickname = "";
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
          setErrorMessage(`Error ${resp?.status}, ${resp?.statusText}`);
          setOpen(true);
        }
      });
  }
}

export default SignUp;