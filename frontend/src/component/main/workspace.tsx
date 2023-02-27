import WorkspaceBar from "./workspaceBar";
import React from "react";
import {Box} from "@mui/material";

function workspace() {
    return (
        <Box sx={{display:"flex", flexDirection:"row", width:"100%", height:"90vh", marginTop: "4em"}}>

            <Box>
        <WorkspaceBar/>
            </Box>
            <Box sx={{flexGrow:1}}>
                Coucou
            </Box>
        </Box>
    );
}

export default workspace;