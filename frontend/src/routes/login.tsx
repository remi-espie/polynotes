import {
    Box,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    TextField,
} from "@mui/material";
import {Link} from "react-router-dom";
import React from "react";
import LoadingButton from '@mui/lab/LoadingButton';
function Login() {
  const [loadingCreate, setLoadingCreate] = React.useState(false);
  const [loadingLogin, setLoadingLogin] = React.useState(false);

  return (
    <div className="App">
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "60vw",
          height: "50vh",
        }}
      >
        <Box
          sx={{
            width: "45%",
            bgcolor: "darkgray",
          }}
        >
          <h2>Create an account</h2>
          <FormGroup>
            <TextField
              id="outlined-basic"
              label="Nickname"
              variant="outlined"
              required
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              required
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              variant="outlined"
              type="password"
              required
            />
            <TextField
              id="outlined-password-input"
              label="Confirm password"
              variant="outlined"
              type="password"
              required
            />
            <FormControlLabel
              control={<Checkbox />}
              label="I'm over 13 years old"
            />
            <FormControlLabel
              control={<Checkbox />}
              label={
                <>
                  <span>I accept the </span>
                  <Link to="/ToS">terms of service</Link>
                </>
              }
            />
            <LoadingButton loading={loadingCreate} variant="contained">
              Create an account
            </LoadingButton>
          </FormGroup>
        </Box>
        <Box
          sx={{
            width: "45%",
            bgcolor: "gray",
          }}
        >
          <h2>Or log in</h2>
          <FormGroup>
            <TextField
              id="outlined-basic"
              label="Nickname or email"
              variant="outlined"
              required
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              variant="outlined"
              type="password"
              required
            />
            <LoadingButton loading={loadingLogin} variant="contained">
              Log in
            </LoadingButton>
          </FormGroup>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
