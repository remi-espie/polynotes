import WorkspaceBar from "./workspaceBar";
import React from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import WorkspaceRecent from "./workspaceRecent";
import WorkspaceFile from "./workspaceFile";
import { workspaceType } from "../../../types";
import { useParams } from "react-router-dom";

function workspace(props: {
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
        marginTop: "4em",
      }}
    >
      <Box>
        <WorkspaceBar
          workspaces={props.workspaces}
          setErrorMessage={props.setErrorMessage}
          setOpenAlert={props.setOpenAlert}
          getWorkspaces={props.getWorkspaces}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 325px)",
          marginLeft: "20px",
        }}
      >
        {type === undefined || type === "folder" ? (
          <>
            <WorkspaceRecent workspaces={props.workspaces} />
            <WorkspaceFile workspaces={props.workspaces} />
          </>
        ) : null}
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