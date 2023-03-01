import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, {TreeItemProps, treeItemClasses} from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import {SvgIconProps} from '@mui/material/SvgIcon';
import {
    Alert, AlertTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Snackbar, TextField, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {Link} from "react-router-dom";
import {Folder, Workspaces} from "@mui/icons-material";
import {createRef, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";


type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({theme}) => ({
    color: "white",
    [`& .${treeItemClasses.content}`]: {
        color: "white",
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0, width: "unset"}}>
                    <Box component={LabelIcon} color="inherit" sx={{mr: 1, width: "unset"}}/>
                    <Typography variant="body2" sx={{fontWeight: 'inherit', width: "unset"}}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit" sx={{paddingLeft: "1em"}}>
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
                width: "fit-content",
            }}
            {...other}
        />
    );
}

export default function IconTreeView() {

    const [openCreate, setOpenCreate] = useState(false);
    const [creationType, setCreationType] = useState('page');
    const name = createRef();

    const [loadingCreate, setLoadingCreate] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newCreationType: string,
    ) => {
        setCreationType(newCreationType);
    };

    function createContent() {
        setLoadingCreate(true);
        const data = {
            "type": creationType,
            "name": name.current.value,
        };

        fetch("/api/page/create", {
            method: "POST",
            mode: "cors",
            headers: {
                // 'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "same-origin",
        })
            .catch((err) => {
                console.error(err);
            })
            .then(async (resp) => {
                if (resp?.status === 401) {
                    setErrorMessage("Invalid Credentials");
                    setOpenAlert(true);
                } else if (resp?.status === 201) {
                    setLoadingCreate(false);
                } else {
                    setErrorMessage(`Error ${resp?.status}, ${resp?.statusText}`);
                    setOpenAlert(true);
                }
                setLoadingCreate(false);
                getWorkspaces();
            });
        setOpenCreate(false);
    }

    useEffect(() => {
        getWorkspaces();
    }, []);

    const [workspaces, setWorkspaces] = useState<any>([]);

    function getWorkspaces() {
        fetch("/api/page", {
            method: "GET",
            mode: "cors",
            headers: {
                // 'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
            .catch((err) => {
                console.error(err);
            })
            .then(async (resp) => {
                if (resp?.status === 401) {
                    setErrorMessage("Invalid Credentials");
                    setOpenAlert(true);
                } else if (resp?.status === 200) {
                    resp = await resp.json();
                    setWorkspaces(resp)
                } else {
                    setErrorMessage(`Error ${resp?.status}, ${resp?.statusText}`);
                    setOpenAlert(true);
                }
            });
    }

    function displayWorkspace(workspaces: any) {
        return workspaces.map((workspace: any) => {
            if (workspace.type === "folder") {
                return (
                    <StyledTreeItem nodeId={workspace._id} labelIcon={Folder} labelText={workspace.name}>
                        {
                            displayWorkspace(workspace.content)
                        }
                    </StyledTreeItem>
                )
            } else {
                return (
                    <StyledTreeItem nodeId={workspace._id} labelIcon={DescriptionIcon} labelText={workspace.name}>
                    </StyledTreeItem>
                )
            }
        })
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "100%", width: 300}}>
            <Button onClick={() => {
                setOpenCreate(true)
            }} variant={"contained"} color="secondary" startIcon={<AddIcon/>}
                    sx={{color: "white", m: 2}}>Create</Button>

            <TreeView
                aria-label="workspace"
                defaultExpanded={['3']}
                defaultCollapseIcon={<ArrowDropDownIcon/>}
                defaultExpandIcon={<ArrowRightIcon/>}
                defaultEndIcon={<div style={{width: 24}}/>}
                sx={{maxWidth: 300, color: "white", overflowY: "auto"}}
            >
                <StyledTreeItem nodeId="0" labelIcon={Workspaces} labelText={"My Workspace"}>
                    {
                        displayWorkspace(workspaces)
                    }
                </StyledTreeItem>
            </TreeView>
            <Divider/>

            <Typography variant="h6" sx={{p: 2}}><Link to={"/home"}>Shared with me</Link></Typography>
            <Divider/>
            <Typography variant="h6" sx={{p: 2}}><Link to={"/home"}>Recent</Link></Typography>
            <Divider/>
            <Typography variant="h6" sx={{p: 2}}><Link to={"/home"}>Starred</Link></Typography>
            <Divider/>
            <Typography variant="h6" sx={{p: 2}}><Link to={"/home"}>Trash</Link></Typography>

            <Dialog
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false)
                }}
                aria-labelledby="dialog-dialog-title"
                aria-describedby="dialog-dialog-description"
                maxWidth={"sm"}
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Create new document?"}
                </DialogTitle>
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column",
                }}>

                    <ToggleButtonGroup
                        color="secondary"
                        value={creationType}
                        exclusive
                        onChange={handleChange}
                        aria-label="Create new document"
                        sx={{justifyContent: "center"}}
                    >
                        <ToggleButton value="page"> <NoteAddIcon/> Page </ToggleButton>
                        <ToggleButton value="folder"><CreateNewFolderIcon/> Folder</ToggleButton>
                    </ToggleButtonGroup>


                    <TextField id="standard-basic" label="Standard" variant="standard"
                               defaultValue="My-totally-randomly-generated-name" inputRef={name}/>


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenCreate(false)
                    }}>Abort</Button>
                    <LoadingButton
                        loading={loadingCreate}
                        onClick={() => {
                            createContent()
                        }} autoFocus>
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert variant="filled" severity="error" onClose={handleClose}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}