import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, {TreeItemProps, treeItemClasses} from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddIcon from '@mui/icons-material/Add';
import {SvgIconProps} from '@mui/material/SvgIcon';
import {Button, Divider} from "@mui/material";
import {Link} from "react-router-dom";
import { Workspaces } from "@mui/icons-material";


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
        marginLeft: 0,
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
    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "100%", width: 300}}>
            <Button variant={"contained"} color="secondary" startIcon={<AddIcon/>}
                    sx={{color: "white", m: 2}}>Create</Button>

            <TreeView
                aria-label="workspace"
                defaultExpanded={['3']}
                defaultCollapseIcon={<ArrowDropDownIcon/>}
                defaultExpandIcon={<ArrowRightIcon/>}
                defaultEndIcon={<div style={{width: 24}}/>}
                sx={{ maxWidth: 300, color: "white", overflowY: "auto"}}
            >
                <StyledTreeItem nodeId="0" labelIcon={Workspaces} labelText={"My Workspace"}>

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
        </Box>
    );
}