import WorkspaceBar from "./workspaceBar";
import React, {useEffect, useState} from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import WorkspaceRecent from "./workspaceRecent";
import WorkspaceExplorer from "./workspaceExplorer";
import {userType, workspaceType} from "../../../types";
import { useParams } from "react-router-dom";
import WorkspacePage from "./workspacePage";
import WorkspaceForm from "./workspaceForm";

function workspace(props: {
    user: userType;
  workspaces: workspaceType[];
  getWorkspaces: () => void;
  setErrorMessage: (value: string) => void;
  setOpenAlert: (value: boolean) => void;
  openAlert: boolean;
  handleClose: () => void;
  errorMessage: string;
}) {
  let { type } = useParams();
  const [displayBar, setDisplayBar] = useState(false);

  useEffect(() => {
      if (Object.keys(props.user).length !== 0) setDisplayBar(true)
  }, [props.user.id])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "90vh",
        marginTop: "4em"
      }}
    >
      {displayBar ? (
        <Box>
          <WorkspaceBar
            workspaces={props.workspaces}
            setErrorMessage={props.setErrorMessage}
            setOpenAlert={props.setOpenAlert}
            getWorkspaces={props.getWorkspaces}
          />
        </Box>
      ) : null}
      <Box display="flex" flexDirection="column" width="80%" margin="0 auto">
        {type === undefined || type === "folder" ? (
          <>
            <WorkspaceRecent workspaces={props.workspaces} />
            <WorkspaceExplorer workspaces={props.workspaces} />
          </>
        ) : type === "form" ? (<WorkspaceForm workspaces={props.workspaces} user={props.user}
                                               getWorkspaces={props.getWorkspaces}/>)
            : (
          <WorkspacePage workspaces={props.workspaces} user={props.user}
                         getWorkspaces={props.getWorkspaces} />
        )}
      </Box>
      <Snackbar
        open={props.openAlert}
        autoHideDuration={6000}
        onClose={props.handleClose}
      >
        <Alert variant="filled" severity="error" onClose={props.handleClose}>
          <AlertTitle>Error</AlertTitle>
          {props.errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default workspace;