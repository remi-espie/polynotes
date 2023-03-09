import React, {useEffect, useState} from "react";
import SearchHeader from "./searchHeader";
import {Box, Divider} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import Profile from "../user/profile";
import {userType, workspaceType} from "../../types";
import Workspace from "./workspace/workspace";

function Main() {

    useEffect(() => {
        isLoggedIn();
        getWorkspaces();
    }, [])

    const [openAlert, setOpenAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [workspaces, setWorkspaces] = useState<any>([]);

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

    function getWorkspaces() {
        fetch("/api/page", {
            method: "GET",
            mode: "cors",
            headers: {
                // 'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        })
            .catch((err) => {
                console.error(err);
            })
            .then(async (resp) => {
                if (resp?.status === 401) {
                    setErrorMessage("Invalid Credentials");
                    setOpenAlert(true);
                } else if (resp?.status === 200) {
                    const workspace: workspaceType[] = await resp.json();
                    setWorkspaces(workspace);
                } else {
                    setErrorMessage(`Error ${resp?.status}, ${resp?.statusText}`);
                    setOpenAlert(true);
                }
            });
    }

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };


    return (
        <Box className="App">
            <SearchHeader user={connectedUser} workspaces={workspaces}/>
            <Divider />
            {
                location.pathname=== "/profile" ?
                    <Profile user={connectedUser} />
                    :
                    <Workspace workspaces={workspaces} getWorkspaces={getWorkspaces} errorMessage={errorMessage} setErrorMessage={setErrorMessage} setOpenAlert={setOpenAlert} openAlert={openAlert} handleClose={handleClose}/>
            }
        </Box>
    )

}

export default Main;