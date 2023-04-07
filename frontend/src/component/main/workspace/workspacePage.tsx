import {userType, workspaceType} from "../../../types";
import React, {createRef, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Snackbar,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import PageContent from "./editor/pageContent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {JSONContent} from "@tiptap/core";
import ShareIcon from "@mui/icons-material/Share";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EditIcon from "@mui/icons-material/Edit";

export default function WorkspacePage(props: {
    workspaces: workspaceType[];
    user: userType;
    getWorkspaces: () => void;
}) {
    const navigate = useNavigate();
    let {id} = useParams();
    const [workspace, setWorkspace] = useState<workspaceType | undefined>();

    const [pageContent, setPageContent] = useState<any[]>([]);
    const [editable, setEditable] = useState<boolean>(false);
    const [reloadKey, setReloadKey] = useState<number>(0);


    let fetchWorkspace = false;

    useEffect(() => {
        if (id === undefined) {
            navigate("/home");
        } else {
            const workspaceLocal = props.workspaces.find(
                (workspace: workspaceType) => workspace.id === id
            );
            setWorkspace(workspaceLocal);

            if (workspaceLocal === undefined) fetchWorkspace = true;
            else {
                setPageContent(workspaceLocal.subContent);
                setEditable(
                    (workspaceLocal.owner === props.user.id ||
                        workspaceLocal.writer.includes("anon")) as boolean
                );
                setReloadKey(reloadKey + 1);
            }
        }
    }, [id]);

    useEffect(() => {
        if (workspace === undefined) return;
        setEditable(
            (workspace!.owner === props.user.id ||
                workspace!.writer.includes("anon")) as boolean
        );
        setReloadKey(reloadKey + 1);
    }, [props.user])

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

    useEffect(() => {
        function getWorkspace() {
            fetch(`/api/page/${id}`, {
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
                    if (resp?.status === 200) {
                        const workspace = await resp.json()
                        setWorkspace(workspace);
                        // subContent = workspace!.subContent;
                        setEditable(
                            (workspace.owner === props.user.id ||
                                workspace.writer.includes("anon")) as boolean
                        );
                        setPageContent(workspace!.subContent);
                    } else {
                        navigate("/login");
                    }
                });
        }

        if (fetchWorkspace) {
            getWorkspace();
            fetchWorkspace = false;
        }
    }, [fetchWorkspace]);

    const defaultColumn = {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [],
            },
        ],
    };

    function addRow() {
        if (editable) {
            setPageContent((prev) => {
                let newContent = prev;
                newContent.push(defaultColumn);
                return newContent;
            });
            setReloadKey(reloadKey + 1);
        }
    }

    function deleteRow(indexRow: number) {
        if (editable) {
            setPageContent((prev) => {
                let newContent = prev;
                newContent.splice(indexRow, 1);
                if (newContent.length === 0) newContent.splice(indexRow, 1);
                return newContent;
            });
            setReloadKey(reloadKey + 1);
            setSendPage(true);
        }
    }

    const [sendPage, setSendPage] = useState(false);

    useEffect(() => {
        if (sendPage && editable) {
            workspace!.subContent = pageContent;
            fetch(`/api/page/${id}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify(workspace),
            })
                .catch((err) => {
                    setErrorMessage(`Error : ${err}`);
                    setOpen(true);
                })
                .then(async (resp) => {
                    if (resp?.status !== 200) {
                        setErrorMessage(`Error : ${resp?.status}, ${resp?.statusText}`);
                        setOpen(true);
                    }
                });
            setSendPage(false);
        }
    }, [sendPage, workspace]);

    const [deletePage, setDeletePage] = useState(false);

    const delPage = () => {
        setDeletePage(true);
    };

    useEffect(() => {
        if (deletePage) {
            fetch(`/api/page/${id}`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                },
                credentials: "same-origin",
            })
                .catch((err) => {
                    setErrorMessage(`Error : ${err}`);
                    setOpen(true);
                })
                .then(async (resp) => {
                    if (resp?.status !== 200) {
                        setErrorMessage(`Error : ${resp?.status}, ${resp?.statusText}`);
                        setOpen(true);
                    } else {
                        props.getWorkspaces();
                        navigate("/home");
                    }
                });
            setDeletePage(false);
        }
    }, [deletePage]);

    const handleShare = () => {
        setOpenShare(true);
    };

    const [openShare, setOpenShare] = useState(false);
    const [shareType, setShareType] = useState("reader");
    const name = createRef<React.InputHTMLAttributes<string>>();
    const [anonymous, setAnonymous] = useState(false);
    const [uploadSharePage, setUploadSharePage] = useState(false);

    const handleAnonymous = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnonymous(event.target.checked);
    };

    const handleShareChange = (
        event: React.MouseEvent<HTMLElement>,
        newShareType: string
    ) => {
        setShareType(newShareType);
    };

    const sharePage = () => {
        const sharedTo = anonymous ? "anon" : (name.current?.value as string);
        if (shareType === "writer") {
            if (!workspace?.writer.includes(sharedTo)) workspace?.writer.push(sharedTo);
            if (!workspace?.reader.includes(sharedTo)) workspace?.reader.push(sharedTo);
        } else if (shareType === "reader") {
            if (!workspace?.reader.includes(sharedTo)) workspace?.reader.push(sharedTo);
        }

        setUploadSharePage(true);
    };

    useEffect(() => {
        if (uploadSharePage) {
            const sharedTo = anonymous ? "anon" : (name.current?.value as string);
            fetch(`/api/page/share/${shareType}/${id}/${sharedTo}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                },
                credentials: "same-origin",
            })
                .catch((err) => {
                    setErrorMessage(`Error : ${err}`);
                    setOpen(true);
                })
                .then(async (resp) => {
                    if (resp?.status !== 200) {
                        setErrorMessage(`Error : ${resp?.status}, ${resp?.statusText}`);
                        setOpen(true);
                    }
                });
            setUploadSharePage(false);
            setOpenShare(false);
        }
    }, [uploadSharePage])

    return (
        <Box key={reloadKey}>
            {pageContent.map((row: JSONContent, indexRow: number) => {
                return (
                    <Box
                        display="flex"
                        flexDirection="row"
                        sx={{width: "99%"}}
                        key={indexRow}
                    >
                        <Box
                            sx={{width: "99%", margin: "auto"}}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <PageContent
                                row={row}
                                editable={editable}
                                setSendPage={setSendPage}
                                setPageContent={setPageContent}
                                index={indexRow}
                            />

                            <IconButton
                                aria-label={"Delete row"}
                                size={"small"}
                                color={"error"}
                                sx={{
                                    height: 32,
                                    width: 32,
                                    marginTop: 2,
                                    display: editable ? "" : "none",
                                }}
                                onClick={() => {
                                    deleteRow(indexRow);
                                }}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                );
            })}

            <Box display="flex" flexDirection="row" justifyContent="space-evenly" key={reloadKey}>
                <Button
                    aria-label={"Add a new row"}
                    size={"large"}
                    color={"secondary"}
                    variant="contained"
                    sx={{width: "20%", display: editable ? "" : "none"}}
                    onClick={addRow}
                >
                    <AddIcon/>
                </Button>

                <Button
                    aria-label={"Share page"}
                    size={"large"}
                    color={"primary"}
                    variant="contained"
                    sx={{width: "20%", display: editable ? "" : "none"}}
                    onClick={handleShare}
                >
                    <ShareIcon/>
                </Button>

                <Button
                    aria-label={"Delete page"}
                    size={"large"}
                    color={"error"}
                    variant="contained"
                    sx={{width: "20%", display: editable ? "" : "none"}}
                    onClick={delPage}
                >
                    <DeleteIcon/>
                </Button>
            </Box>

            <Dialog
                open={openShare}
                onClose={() => {
                    setOpenShare(false);
                }}
                aria-labelledby="dialog-dialog-title"
                aria-describedby="dialog-dialog-description"
                maxWidth={"sm"}
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">Share file ?</DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <ToggleButtonGroup
                        color="secondary"
                        value={shareType}
                        exclusive
                        onChange={handleShareChange}
                        aria-label="Create new document"
                        sx={{justifyContent: "center"}}
                    >
                        <ToggleButton value="reader">
                            {" "}
                            <AutoStoriesIcon/> Reader{" "}
                        </ToggleButton>
                        <ToggleButton value="writer">
                            <EditIcon/> Writer
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <TextField
                        id="standard-basic"
                        label="Share to user"
                        variant="standard"
                        defaultValue=""
                        inputRef={name}
                        disabled={anonymous}
                    />

                    <FormControlLabel
                        control={<Switch onChange={handleAnonymous}/>}
                        label="Anonymous"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenShare(false);
                        }}
                    >
                        Abort
                    </Button>
                    <Button onClick={sharePage} autoFocus>
                        Share
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert variant="filled" severity="error" onClose={handleClose}>
                    <AlertTitle>Page cannot be saved !</AlertTitle>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}