import React, {useEffect, useState} from "react";
import SearchHeader from "./main/searchHeader";
import {Box, Divider} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import Profile from "./user/profile";
import {userType, workspaceType} from "../types";
import Workspace from "./main/workspace/workspace";

function Main() {
    useEffect(() => {
        isLoggedIn();
        getWorkspaces();
    }, []);

    const [openAlert, setOpenAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [workspaces, setWorkspaces] = useState<workspaceType[]>([]);

    const [connectedUser, setConnectedUser] = useState({} as userType);

    const navigate = useNavigate();
    const location = useLocation();

    async function isLoggedIn() {
        fetch("/api/user").then((resp) => {
            if (resp.status !== 200) {
                if (
                    !location.pathname.includes("/home/page/") &&
                    !location.pathname.includes("/home/folder/")
                ) {
                    navigate("/login");
                }
            } else {
                resp.json().then((json) => {
                    setConnectedUser(json);
                });
            }
        });
    }

    function getWorkspaces() {
        fetch("/api/page", {
            method: "GET",
            mode: "cors",
            headers: {
                'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
            .catch((err) => {
                console.error(err);
            })
            .then(async (resp) => {
                if (resp?.status === 401) {
                    setErrorMessage("Invalid Credentials");
                    setOpenAlert(true);
                } else if (resp?.status === 200) {
                    let workspace: workspaceType[] = await resp.json();

                    workspace.sort((a) => {
                        return a.type === "folder" ? 0 : 1;
                    });

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
            <Divider/>
            {location.pathname === "/profile" &&
            Object.keys(connectedUser).length !== 0 ? (
                <Profile user={connectedUser}/>
            ) : (
                <Workspace
                    user={connectedUser}
                    workspaces={workspaces}
                    getWorkspaces={getWorkspaces}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    setOpenAlert={setOpenAlert}
                    openAlert={openAlert}
                    handleClose={handleClose}
                />
            )}
        </Box>
    );
}

export default Main;