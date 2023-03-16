import {userType, workspaceType} from "../../../types";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, AlertTitle, Box, Button, Snackbar} from "@mui/material";
import PageContent from "./editor/pageContent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import {JSONContent} from "@tiptap/core";

export default function WorkspacePage(props: { workspaces: workspaceType[], user: userType }) {

    const navigate = useNavigate();
    let {id} = useParams();
    let workspace: workspaceType | undefined;

    const [pageContent, setPageContent] = useState<any[]>([])
    const [editable, setEditable] = useState<boolean>(false)
    const [reloadKey, setReloadKey] = useState<number>(0)

    let subContent: any[] = [];
    let changeContent = false;

    let fetchWorkspace = false;


    if (id === undefined) {
        navigate("/home");
    } else {
        workspace = props.workspaces.find(
            (workspace: workspaceType) => workspace.id === id
        )

        if (workspace === undefined) fetchWorkspace = true
        else {
            subContent = workspace.subContent
            changeContent = true
        }

    }

    useEffect(() => {
        function getWorkspace() {
            fetch(`/api/page/${id}`, {
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
                    if (resp?.status === 200) {
                        workspace = await resp.json();
                        subContent = workspace!.subContent
                        setEditable((workspace?.owner === props.user.id || workspace?.writer.includes("anon")) as boolean)
                        setPageContent(subContent)
                    } else {
                        navigate("/login");
                    }
                });
        }
        if (fetchWorkspace){
            getWorkspace()
            fetchWorkspace = false
        }

    }, [fetchWorkspace])

    useEffect(() => {
        function changeContentState() {
            setPageContent(subContent)
            setEditable((workspace?.owner === props.user.id || workspace?.writer.includes("anon")) as boolean)
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
        setSendPage(true)
    }

    const [sendPage, setSendPage] = useState(false)

    useEffect(() => {
        if (sendPage){
            workspace!.subContent = pageContent
            fetch(`/api/page/${id}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    // 'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify(workspace)
            })
                .catch((err) => {
                    setErrorMessage(`Error : ${err}`)
                    setOpen(true)
                })
                .then(async (resp) => {
                    if (resp?.status !== 200) {
                        setErrorMessage(`Error : ${resp?.status}, ${resp?.statusText}`)
                        setOpen(true)
                    }
                })
            setSendPage(false)
        }
    }, [sendPage])



    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <Box>
            {pageContent.map((row: JSONContent, indexRow: number) => {
                return (
                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{width: "99%"}}
                        key={indexRow}
                    >
                        <Box sx={{width: "99%", margin: "auto"}} display="flex" flexDirection="row" alignItems="center">
                            <PageContent row={row} editable={editable} setSendPage={setSendPage} setPageContent={setPageContent} index={indexRow} />
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

                        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                            <Alert variant="filled" severity="error" onClose={handleClose}>
                                <AlertTitle>Page cannot be saved !</AlertTitle>
                                {errorMessage}
                            </Alert>
                        </Snackbar>
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

