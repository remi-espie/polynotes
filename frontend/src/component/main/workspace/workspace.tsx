import WorkspaceBar from "./workspaceBar";
import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import WorkspaceRecent from "./workspaceRecent";
import WorkspaceFile from "./workspaceFile";
import {workspaceType} from "../../../types";

function workspace(props: { workspaces: workspaceType[]; getWorkspaces: () => void; setErrorMessage: (value: string) => void; setOpenAlert: (value: boolean) => void; openAlert: boolean; handleClose: () => void; errorMessage: string; }) {


  return (
    <Box sx={{ display: "flex", flexDirection: "row", width: "100%", height: "90vh", marginTop: "4em" }}>

      <Box>
        <WorkspaceBar workspaces={props.workspaces} setErrorMessage={props.setErrorMessage} setOpenAlert={props.setOpenAlert} getWorkspaces={props.getWorkspaces} />
      </Box>
      <Box sx={{ display:"flex", flexDirection:"column", width:"calc(100% - 325px)", marginLeft:"20px" }}>

        <WorkspaceRecent workspaces={props.workspaces}/>
        <WorkspaceFile workspaces={props.workspaces}/>
      </Box>
      <Snackbar open={props.openAlert} autoHideDuration={6000} onClose={props.handleClose}>
        <Alert variant="filled" severity="error" onClose={props.handleClose}>
          <AlertTitle>Error</AlertTitle>
          {props.errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default workspace;