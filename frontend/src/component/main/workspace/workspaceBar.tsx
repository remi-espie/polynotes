import * as React from "react";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, {TreeItemProps, treeItemClasses} from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import {SvgIconProps} from "@mui/material/SvgIcon";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Folder, Workspaces} from "@mui/icons-material";
import {createRef, SyntheticEvent, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {workspaceType} from "../../../types";


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
        "&.Mui-expanded": {
            fontWeight: theme.typography.fontWeightRegular
        },
        "&:hover": {
            backgroundColor: theme.palette.action.hover
        },
        "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: "var(--tree-view-color)"
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: "inherit",
            color: "inherit"
        }
    },
    [`& .${treeItemClasses.group}`]: {
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2)
        }
    }
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
                <Box sx={{display: "flex", alignItems: "center", p: 0.5, pr: 0, width: "unset"}}>
                    <Box component={LabelIcon} color="inherit" sx={{mr: 1, width: "unset"}}/>
                    <Typography variant="body2" sx={{fontWeight: "inherit", width: "unset"}}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit" sx={{paddingLeft: "1em"}}>
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                width: "fit-content"
            }}
            {...other}
        />
    );
}

export default function WorkspaceBar(props: { workspaces: workspaceType[], setErrorMessage: (workspace: string) => void, setOpenAlert: (state: boolean) => void, getWorkspaces: () => void }) {

    const [openCreate, setOpenCreate] = useState(false);
    const [creationType, setCreationType] = useState("page");
    const name = createRef<React.InputHTMLAttributes<string>>();
    const [randomName, setRandomName] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState("0");
    const [loadingCreate, setLoadingCreate] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getRandomName();
    }, []);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newCreationType: string
    ) => {
        setCreationType(newCreationType);
    };

    const getRandomName = () => {
        fetch("/random-name", {
            method: "GET",
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            }
        })
            .then((resp) => resp.json())
            .then((json) => {
                setRandomName(json[0]);
            });
    };

    const handleOpenCreate = () => {
        getRandomName();
        setOpenCreate(true);
    };

    function createContent() {
        setLoadingCreate(true);
        const data = {
            "type": creationType,
            "name": name.current?.value
        }

        const workspace: workspaceType | undefined = props.workspaces.find((workspace) => workspace._id === selectedWorkspace);
        let url = "/api/page/create";
        if (workspace?.type === "folder") {
            url += `/${workspace._id}`;
        }
        else if (workspace?.type === "page") {
            url += `/${workspace.parentId}`;
        }


        fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                // 'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "same-origin"
        })
            .catch((err) => {
                console.error(err);
            })
            .then(async (resp) => {
                if (resp?.status === 401) {
                    props.setErrorMessage("Invalid Credentials");
                    props.setOpenAlert(true);
                } else if (resp?.status === 201) {
                    setLoadingCreate(false);
                } else {
                    props.setErrorMessage(`Error ${resp?.status}, ${resp?.statusText}`);
                    props.setOpenAlert(true);
                }
                setLoadingCreate(false);
                props.getWorkspaces();
            });
        setOpenCreate(false);
    }

    function displayWorkspace(workspaces: workspaceType[], parent: string | null) {
        const workspaceParent = workspaces.filter((workspace: workspaceType) => workspace.parentId === parent);
        return workspaceParent.map((workspace: workspaceType) => {
            return (
                <StyledTreeItem nodeId={workspace._id}
                                labelIcon={workspace.type === "folder" ? Folder : DescriptionIcon}
                                labelText={workspace.name} key={workspace._id} onClick={() => {
                    if (workspace.type === "page") {
                        navigate(`/page/${workspace._id}`);
                    }
                }
                }>
                    {
                        displayWorkspace(workspaces, workspace._id)
                    }
                </StyledTreeItem>
            );
        });
    }

    const handleSelectedItems = (event: SyntheticEvent, nodeId: string) => {
        setSelectedWorkspace(nodeId);
    };


    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "100%", width: 300}}>
            <Button onClick={() => {
                handleOpenCreate();
            }} variant={"contained"} color="secondary" startIcon={<AddIcon/>}
                    sx={{color: "white", m: 2}}>Create</Button>

            <TreeView
                aria-label="workspace"
                defaultExpanded={["3"]}
                defaultCollapseIcon={<ArrowDropDownIcon/>}
                defaultExpandIcon={<ArrowRightIcon/>}
                defaultEndIcon={<div style={{width: 24}}/>}
                sx={{maxWidth: 300, color: "white", overflowY: "auto"}}
                onNodeSelect={handleSelectedItems}
            >
                <StyledTreeItem nodeId="0" labelIcon={Workspaces} labelText={"My Workspace"}>
                    {
                        displayWorkspace(props.workspaces, null)
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
                    setOpenCreate(false);
                }}
                aria-labelledby="dialog-dialog-title"
                aria-describedby="dialog-dialog-description"
                maxWidth={"sm"}
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Create new document in " + props.workspaces.filter((workspace: workspaceType) => workspace._id === selectedWorkspace)[0]?.name + "?"}
                </DialogTitle>
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column"
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
                               defaultValue={randomName} inputRef={name}/>


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenCreate(false);
                    }}>Abort</Button>
                    <LoadingButton
                        loading={loadingCreate}
                        onClick={() => {
                            createContent();
                        }} autoFocus>
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}