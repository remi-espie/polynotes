import WorkspaceBar from "./workspaceBar";
import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import WorkspaceRecent from "./workspaceRecent";

function workspace() {

  useEffect(() => {
    getWorkspaces();
  }, []);

  const [workspaces, setWorkspaces] = useState<any>([]);

  const [openAlert, setOpenAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
          resp = await resp.json();
          setWorkspaces(resp);
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
    <Box sx={{ display: "flex", flexDirection: "row", width: "100%", height: "90vh", marginTop: "4em" }}>

      <Box>
        <WorkspaceBar workspaces={workspaces} setErrorMessage={setErrorMessage} setOpenAlert={setOpenAlert} getWorkspaces={getWorkspaces} />
      </Box>
      <Box sx={{ display:"flex", flexDirection:"column", width:"calc(100% - 325px)", marginLeft:"20px" }}>
        Coucou
        <WorkspaceRecent workspaces={workspaces} />
      </Box>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert variant="filled" severity="error" onClose={handleClose}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default workspace;