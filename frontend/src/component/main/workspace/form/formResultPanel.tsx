import {workspaceType} from "../../../../types";
import React from "react";

export default function FormResultPanel(props:{
    workspace: workspaceType,
    pageContent: any[],
    setPageContent: React.Dispatch<React.SetStateAction<any[]>>,
    editable: boolean,
    id: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getWorkspaces: () => void,
}) {



    return (
        <h1>test</h1>
    )
}