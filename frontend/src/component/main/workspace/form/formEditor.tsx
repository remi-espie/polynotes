import {
    Box,
    Button,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    FormControlLabel,
    Menu,
    MenuItem, Switch,
    Tab,
    Tabs,
} from "@mui/material";
import FormRow from "./formRow";
import React, {useEffect, useState} from "react";
import {TabContext, TabPanel} from "@mui/lab";
import FormRowEditor from "./formRowEditor";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShareIcon from "@mui/icons-material/Share";
import {DefaultCopyField} from "@eisberg-labs/mui-copy-field";
import {workspaceType} from "../../../../types";
import {useNavigate} from "react-router-dom";

export default function FormEditor(props: {
    workspace: workspaceType,
    editable: boolean,
    pageContent: any[],
    setPageContent: React.Dispatch<React.SetStateAction<any[]>>,
    reloadKey: number,
    setReloadKey: (arg0: any) => void,
    id: string,
    setErrorMessage: (arg0: string) => void,
    setOpen: (arg0: boolean) => void,
    getWorkspaces: () => void,
}) {

    const navigate = useNavigate();

    useEffect(() => {
        if (props.workspace !== undefined) setShared(props.workspace.reader.includes("anon"));
    }, [props.workspace])

    function addRow(type: string) {
        if (props.editable) {
            props.setPageContent((prev) => {
                let newContent = prev;
                const row = new FormRow(type)
                newContent.push(row);
                return newContent;
            });
            props.setReloadKey(props.reloadKey + 1);
        }
    }

    function deleteRow(indexRow: number) {
        if (props.editable) {
            props.setPageContent((prev) => {
                let newContent = prev;
                newContent.splice(indexRow, 1);
                if (newContent.length === 0) newContent.splice(indexRow, 1);
                return newContent;
            });
            props.setReloadKey(props.reloadKey + 1);
            setSendPage(true);
        }
    }

    const [sendPage, setSendPage] = useState(false);

    useEffect(() => {
        if (sendPage) {
            console.log(props.pageContent)
            props.workspace!.subContent = props.pageContent;
            fetch(`/api/page/${props.id}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                body: JSON.stringify(props.workspace),
            })
                .catch((err) => {
                    props.setErrorMessage(`Error : ${err}`);
                    props.setOpen(true);
                })
                .then(async (resp) => {
                    if (resp?.status !== 200) {
                        props.setErrorMessage(`Error : ${resp?.status}, ${resp?.statusText}`);
                        props.setOpen(true);
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
            fetch(`/api/page/${props.id}`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                },
                credentials: "same-origin",
            })
                .catch((err) => {
                    props.setErrorMessage(`Error : ${err}`);
                    props.setOpen(true);
                })
                .then(async (resp) => {
                    if (resp?.status !== 200) {
                        props.setErrorMessage(`Error : ${resp?.status}, ${resp?.statusText}`);
                        props.setOpen(true);
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
            fetch(`/api/page/share/${shared}/${props.id}/anon`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                },
                credentials: "same-origin",
            })
                .catch((err) => {
                    props.setErrorMessage(`Error : ${err}`);
                    props.setOpen(true);
                })
                .then(async (resp) => {
                    if (resp?.status !== 200) {
                        props.setErrorMessage(`Error : ${resp?.status}, ${resp?.statusText}`);
                        props.setOpen(true);
                    }
                    if (shared) props.workspace?.reader.push("anon");
                    else props.workspace?.reader.splice(props.workspace?.reader.indexOf("anon"), 1);
                });
            setUploadSharePage(false);
            setOpenShare(false);
        }
    }, [uploadSharePage])


    const [tabValue, setTabValue] = React.useState("Form");

    return (
        <TabContext value={tabValue.toString()}>
            <Box key={props.reloadKey}>
                <Tabs value={tabValue}
                      onChange={(event: React.SyntheticEvent, newValue: string) => {
                          setTabValue(newValue);
                      }}
                      variant="fullWidth"
                >
                    <Tab label="Form" value={"Form"}/>
                    <Tab label="Results" value={"Result"}/>
                </Tabs>
                <TabPanel value={"Form"}>

                    {props.pageContent.map((row: FormRow, indexRow: number) => {
                        return (
                            <Box
                                display="flex"
                                flexDirection="row"
                                sx={{width: "99%"}}
                                key={indexRow+1}
                            >

                                <Box
                                    sx={{width: "99%", margin: "auto"}}
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                >
                                    <FormRowEditor
                                        row={row}
                                        editable={props.editable}
                                        sendPage={sendPage}
                                        setSendPage={setSendPage}
                                        setPageContent={props.setPageContent}
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
                                            display: props.editable ? "" : "none",
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

                    <Box display="flex" flexDirection="row" justifyContent="space-evenly" key={props.reloadKey}>
                        <Button
                            aria-label={"Add a new row"}
                            size={"large"}
                            color={"secondary"}
                            variant="contained"
                            sx={{width: "20%", display: props.editable ? "" : "none"}}
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
                            sx={{width: "20%", display: props.editable ? "" : "none"}}
                            onClick={handleShare}
                        >
                            <ShareIcon/>
                        </Button>

                        <Button
                            aria-label={"Delete page"}
                            size={"large"}
                            color={"error"}
                            variant="contained"
                            sx={{width: "20%", display: props.editable ? "" : "none"}}
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
                                control={<Switch onChange={handleShareChange}
                                                 checked={shared === undefined ? false : shared}/>}
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
            </Box>
        </TabContext>
    );
}