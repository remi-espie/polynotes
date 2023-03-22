import WorkspaceBar from "./workspaceBar";
import React from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import WorkspaceRecent from "./workspaceRecent";
import WorkspaceExplorer from "./workspaceExplorer";
import {userType, workspaceType} from "../../../types";
import { useParams } from "react-router-dom";
import WorkspacePage from "./workspacePage";

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
      {Object.keys(props.user).length !== 0  ? (
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
        ) : (
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