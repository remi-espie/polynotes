import {workspaceType} from "../../../types";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Button} from "@mui/material";
import PageContent from "./editor/pageContent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';

export default function WorkspacePage(props: { workspaces: workspaceType[] }) {

    const navigate = useNavigate();
    let {id} = useParams();
    let workspace: workspaceType | undefined;

    const [pageContent, setPageContent] = useState<any[]>([])
    const [reloadKey, setReloadKey] = useState<number>(0)

    let subContent: any[] = [];
    let changeContent = false;


    if (id === undefined) {
        navigate("/home");
    } else {
        workspace = props.workspaces.find(
            (workspace: workspaceType) => workspace._id === id
        )

        if (workspace === undefined) navigate("/home");
        else {
            subContent = JSON.parse(workspace.subContent)
            changeContent = true
        }

    }

    useEffect(() => {
        function changeContentState() {
            setPageContent(subContent)
        }

        if (changeContent) {
            changeContentState()
            changeContent = false
        }
    }, [changeContent])


    const defaultColumn = [
        {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Write your story !',
                        },
                    ],
                },
            ],
        },
    ];

    function addRow() {
        setPageContent((prev) => {
            let newContent = prev
            newContent.push(defaultColumn[0])
            return newContent
        })
        setReloadKey(reloadKey + 1)
    }

    function deleteRow(indexRow: number) {
        setPageContent((prev) => {
            let newContent = prev
            newContent.splice(indexRow, 1)
            if (newContent.length === 0) newContent.splice(indexRow, 1)
            return newContent
        })
        setReloadKey(reloadKey + 1)
    }


    return (
        <Box>
            {pageContent.map((row: any[], indexRow: number) => {
                return (
                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{width: "99%"}}
                        key={indexRow}
                    >
                        <Box sx={{width: "99%", margin: "auto"}} display="flex" flexDirection="row" alignItems="center">
                            <PageContent row={row}/>
                            <IconButton
                                aria-label={"Delete row"}
                                size={"small"}
                                color={"error"}
                                sx={{height: 32, width: 32, marginTop: 2}}
                                onClick={() => {
                                    deleteRow(indexRow)
                                }}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                );

            })}
            <Button
                aria-label={"Add a new row"}
                size={"large"}
                color={"secondary"}
                variant="contained"
                sx={{width: "80%"}}
                onClick={() => {
                    addRow();
                }}
            >
                <AddIcon/>
            </Button>
        </Box>
    );
}

