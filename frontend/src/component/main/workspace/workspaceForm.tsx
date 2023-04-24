import {userType, workspaceType} from "../../../types";
import React, {useEffect, useState} from "react";
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
    FormControlLabel, Menu, MenuItem,
    Snackbar,
    Switch, Tab, Tabs,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import {DefaultCopyField} from "@eisberg-labs/mui-copy-field";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {TabContext, TabPanel} from "@mui/lab";
import FormRow from "./form/formRow";
import FormContent from "./form/formContent";


export default function WorkspaceForm(props: {
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
                setShared(workspace!.reader.includes("anon"));
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
                        setShared(workspace!.reader.includes("anon"));
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


    function addRow(type: string) {
        if (editable) {
            setPageContent((prev) => {
                let newContent = prev;
                const row = new FormRow(type)
                newContent.push(row);
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
        if (sendPage) {
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
    }, [sendPage]);

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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openAddMenu = Boolean(anchorEl);
    const [openShare, setOpenShare] = useState(false);
    const [shared, setShared] = useState(false);
    const [uploadSharePage, setUploadSharePage] = useState(false);


    const handleShareChange = (
        event: React.ChangeEvent<HTMLElement>,
        newShared: boolean
    ) => {
        setShared(newShared);
    };

    const sharePage = () => {
        setUploadSharePage(true);
    };

    useEffect(() => {
        if (uploadSharePage) {
            fetch(`/api/page/share/${shared}/${id}/anon`, {
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
                    if (shared) workspace?.reader.push("anon");
                    else workspace?.reader.splice(workspace?.reader.indexOf("anon"), 1);
                });
            setUploadSharePage(false);
            setOpenShare(false);
        }
    }, [uploadSharePage])


    const [tabValue, setTabValue] = React.useState("Form");

    return (
        <TabContext value={tabValue.toString()}>
            <Box key={reloadKey}>
                <Tabs value={tabValue}
                      onChange={(event: React.SyntheticEvent, newValue: string) => {
                          setTabValue(newValue);
                      }}
                      variant="fullWidth"
                >
                    <Tab label="Form" value={"Form"} />
                    <Tab label="Results" value={"Result"} />
                </Tabs>
                <TabPanel value={"Form"}>
                    {pageContent.map((row: FormRow, indexRow: number) => {
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
                                    <FormContent
                                        row={row}
                                        editable={editable}
                                        sendPage={sendPage}
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
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                setAnchorEl(event.currentTarget);
                            }}
                            endIcon={<KeyboardArrowDownIcon/>}
                        >
                            Add
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openAddMenu}
                            onClose={() => {
                                setAnchorEl(null);
                            }}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => {
                                addRow("text");
                                setAnchorEl(null);
                            }}>Text input</MenuItem>

                            <MenuItem onClick={() => {
                                addRow("paragraph");
                                setAnchorEl(null);
                            }}>Text area</MenuItem>

                            <MenuItem onClick={() => {
                                addRow("integer");
                                setAnchorEl(null);
                            }}>Integer</MenuItem>

                            <MenuItem onClick={() => {
                                addRow("checkbox");
                                setAnchorEl(null);
                            }}>Checkboxes</MenuItem>

                            <MenuItem onClick={() => {
                                addRow("radio");
                                setAnchorEl(null);
                            }}>Radio Button</MenuItem>
                        </Menu>

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

                            <FormControlLabel
                                control={<Switch onChange={handleShareChange} checked={shared === undefined ? false : shared}/>}
                                label="Shared ?"
                                sx={{marginBottom: 2}}
                            />

                            <DefaultCopyField
                                label="Form URL"
                                disabled
                                value={window.location}/>
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
                </TabPanel>
                <TabPanel value={"Result"}>
                    <Box>
                        Test
                    </Box>
                </TabPanel>


                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                    <Alert variant="filled" severity="error" onClose={handleClose}>
                        <AlertTitle>Page cannot be saved !</AlertTitle>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </TabContext>
    );
}