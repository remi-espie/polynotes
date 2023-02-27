import {Box} from "@mui/material";
import React from "react";
import SignIn from "../component/user/signin";
import Signup from "../component/user/signup";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    async function isLoggedIn() {
        fetch("/api/user").then((resp) => {
            if (resp.status === 200) {
                navigate("/home");
            }
        });
    }

    isLoggedIn();

    return (
        <Box className="App" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "60vw",
                    alignItems: "center",
                }}
            >
                <Signup/>
                <SignIn/>
            </Box>
        </Box>
    );
}

export default Login;
