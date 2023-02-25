import {Box} from "@mui/material";
import React from "react";
import SignIn from "../component/login/signin";
import Signup from "../component/login/signup";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    async function isLoggedIn() {
        fetch("http://localhost:3001/api/user").then((resp) => {
            if (resp.status === 200) {
                navigate("/coucou0");
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
