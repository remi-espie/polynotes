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
    Drawer,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    useTheme,
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Folder, Workspaces} from "@mui/icons-material";
import {createRef, SyntheticEvent, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {workspaceType} from "../../../types";
import IconButton from "@mui/material/IconButton";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({theme}) => ({
    [`& .${treeItemClasses.content}`]: {
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        "&.Mui-expanded": {
            fontWeight: theme.typography.fontWeightRegular,
        },
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
        "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: "var(--tree-view-color)",
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: "inherit",
            color: "inherit",
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 0.5,
                        pr: 0,
                        width: "unset",
                    }}
                >
                    <Box
                        component={LabelIcon}
                        color="inherit"
                        sx={{mr: 1, width: "unset"}}
                    />
                    <Typography
                        variant="body2"
                        sx={{fontWeight: "inherit", width: "unset"}}
                    >
                        {labelText}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="inherit"
                        sx={{paddingLeft: "1em"}}
                    >
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                width: "fit-content",
            }}
            {...other}
        />
    );
}

export default function WorkspaceBar(props: {
    workspaces: workspaceType[];
    setErrorMessage: (workspace: string) => void;
    setOpenAlert: (state: boolean) => void;
    getWorkspaces: () => void;
}) {
    const [openCreate, setOpenCreate] = useState(false);
    const [creationType, setCreationType] = useState("page");
    const name = createRef<React.InputHTMLAttributes<string>>();
    const [randomName, setRandomName] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState("0");
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [createContent, setCreateContent] = useState(false);

    let {id} = useParams();

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

    const handleOpenCreate = () => {
        setOpenCreate(true);
    };

    function getRandomName() {
        fetch("/random-name", {
            method: "GET",
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((json) => {
                setRandomName(json[0]);
            });
    }

    function uploadContent() {
        setLoadingCreate(true);
        const data = {
            type: creationType,
            name: name.current?.value,
        };

        const workspace: workspaceType | undefined = props.workspaces.find(
            (workspace) => workspace.id === selectedWorkspace
        );
        let url = "/api/page";

        if (workspace === undefined) {
            if (
                id !== undefined &&
                props.workspaces.find((workspace) => workspace.id === id)!.type ===
                "folder"
            ) {
                url += `/${id}`;
            }
        } else if (workspace?.type === "folder") {
            url += `/${workspace.id}`;
        } else if (workspace?.type === "page") {
            url += `/${workspace.parentId}`;
        }

        fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                'Access-Control-Allow-Origin': 'https://cluster-2022-2.dopolytech.fr/',
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
        setCreateContent(false);
    }

    useEffect(() => {
        if (createContent) {
            uploadContent();
            getRandomName();
        }
    }, [createContent]);

    function displayWorkspace(
        workspaces: workspaceType[],
        parent: string | null
    ) {
        const workspaceParent = workspaces.filter(
            (workspace: workspaceType) => workspace.parentId === parent
        );
        return workspaceParent.map((workspace: workspaceType) => {
            return (
                <StyledTreeItem
                    nodeId={workspace.id}
                    labelIcon={workspace.type === "folder" ? Folder : DescriptionIcon}
                    labelText={workspace.name}
                    key={workspace.id}
                    onClick={() => {
                        if (workspace.type === "page") {
                            navigate(`/home/page/${workspace.id}`);
                        }
                    }}
                >
                    {displayWorkspace(workspaces, workspace.id)}
                </StyledTreeItem>
            );
        });
    }

    const handleSelectedItems = (event: SyntheticEvent, nodeId: string) => {
        setSelectedWorkspace(nodeId);
    };

    const theme = useTheme();

    const DrawerHeader = styled("div")(({theme}) => ({
        display: "flex",
        alignItems: "center",
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    }));

    const drawerWidth = 300;

    const [openDrawer, setOpenDrawer] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    return (
        <>
            <DrawerHeader sx={{
                display: !openDrawer ? "flex" : "none",
            }}>
                <IconButton onClick={handleDrawerOpen}>
                    {theme.direction === "rtl" ? (
                        <ChevronLeftIcon/>
                    ) : (
                        <ChevronRightIcon/>
                    )}
                </IconButton>
            </DrawerHeader>
            <Drawer
                sx={{
                    width: openDrawer ? drawerWidth : 0,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        top: "unset",
                        width: drawerWidth,
                    },
                }}
                variant="persistent"
                anchor="left"
                open={openDrawer}
            >

                <Divider/>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <Button
                            onClick={() => {
                                handleOpenCreate();
                            }}
                            variant={"contained"}
                            color="secondary"
                            startIcon={<AddIcon/>}
                            sx={{color: "white", m: 2, flexGrow: 1}}
                        >
                            Create
                        </Button>
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === "rtl" ? (
                                    <ChevronRightIcon/>
                                ) : (
                                    <ChevronLeftIcon/>
                                )}
                            </IconButton>
                        </DrawerHeader>
                    </Box>

                    <TreeView
                        aria-label="workspace"
                        defaultExpanded={["0"]}
                        defaultCollapseIcon={<ArrowDropDownIcon/>}
                        defaultExpandIcon={<ArrowRightIcon/>}
                        defaultEndIcon={<div style={{width: 24}}/>}
                        sx={{maxWidth: 300, overflowY: "auto"}}
                        onNodeSelect={handleSelectedItems}
                    >
                        <StyledTreeItem
                            nodeId="0"
                            labelIcon={Workspaces}
                            labelText={"My Workspace"}
                        >
                            {displayWorkspace(props.workspaces, null)}
                        </StyledTreeItem>
                    </TreeView>
                    <Divider/>

                    <Typography variant="h6" sx={{p: 2}}>
                        <Link to={"/home"}>Shared with me</Link>
                    </Typography>
                    <Divider/>
                    <Typography variant="h6" sx={{p: 2}}>
                        <Link to={"/home"}>Recent</Link>
                    </Typography>
                    <Divider/>
                    <Typography variant="h6" sx={{p: 2}}>
                        <Link to={"/home"}>Starred</Link>
                    </Typography>
                    <Divider/>
                    <Typography variant="h6" sx={{p: 2}}>
                        <Link to={"/home"}>Trash</Link>
                    </Typography>

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
                            {selectedWorkspace === "0"
                                ? "Create new content in home ?"
                                : "Create new content in " +
                                props.workspaces.filter(
                                    (workspace: workspaceType) =>
                                        workspace.id === selectedWorkspace
                                )[0]?.name +
                                "?"}
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <ToggleButtonGroup
                                color="secondary"
                                value={creationType}
                                exclusive
                                onChange={handleChange}
                                aria-label="Create new document"
                                sx={{justifyContent: "center"}}
                            >
                                <ToggleButton value="page">
                                    {" "}
                                    <NoteAddIcon/> Page{" "}
                                </ToggleButton>
                                <ToggleButton value="folder">
                                    <CreateNewFolderIcon/> Folder
                                </ToggleButton>
                            </ToggleButtonGroup>

                            <TextField
                                id="standard-basic"
                                label="File name"
                                variant="standard"
                                defaultValue={randomName}
                                inputRef={name}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setOpenCreate(false);
                                }}
                            >
                                Abort
                            </Button>
                            <LoadingButton
                                loading={loadingCreate}
                                onClick={() => {
                                    setCreateContent(true);
                                }}
                                autoFocus
                            >
                                Create
                            </LoadingButton>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Drawer>
        </>
    );
}