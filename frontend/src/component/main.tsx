import React, {useEffect, useState} from "react";
import Header from "./header";
import {Box} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import Profile from "./user/profile";
import {user} from "../types";

function Main() {

    useEffect(() => {
        isLoggedIn();
    }, [])


    const [connectedUser, setConnectedUser] = useState({} as user);

    const navigate = useNavigate();
    const location = useLocation()

    async function isLoggedIn() {
        fetch('/api/user')
            .then(resp => {
                if (resp.status !== 200) {
                    navigate("/user");
                } else {
                    resp.json().then(json => {
                        setConnectedUser(json._doc);
                    })
                }
            })
    }


    return (
        <Box className="App">
            <Header _id={connectedUser._id} validated={connectedUser.validated} createdAt={connectedUser.createdAt} email={connectedUser.email} nickname={connectedUser.nickname} />
            {
                location.pathname=== "/profile" ? <Profile _id={connectedUser._id} validated={connectedUser.validated} createdAt={connectedUser.createdAt} email={connectedUser.email} nickname={connectedUser.nickname}/> : <></>
            }
        </Box>
    )

}

export default Main;