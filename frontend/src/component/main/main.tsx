import React, {useEffect, useState} from "react";
import Header from "./header";
import {Box, Divider} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import Profile from "../user/profile";
import {userType} from "../../types";
import Workspace from "./workspace/workspace";

function Main() {

    useEffect(() => {
        isLoggedIn();
    }, [])


    const [connectedUser, setConnectedUser] = useState({} as userType);

    const navigate = useNavigate();
    const location = useLocation()

    async function isLoggedIn() {
        fetch('/api/user')
            .then(resp => {
                if (resp.status !== 200) {
                    navigate("/login");
                } else {
                    resp.json().then(json => {
                        setConnectedUser(json);
                    })
                }
            })
    }


    return (
        <Box className="App">
            <Header _id={connectedUser._id} validated={connectedUser.validated} createdAt={connectedUser.createdAt} email={connectedUser.email} nickname={connectedUser.nickname} />
            <Divider />
            {
                location.pathname=== "/profile" ? <Profile _id={connectedUser._id} validated={connectedUser.validated} createdAt={connectedUser.createdAt} email={connectedUser.email} nickname={connectedUser.nickname}/> : <Workspace/>
            }
        </Box>
    )

}

export default Main;