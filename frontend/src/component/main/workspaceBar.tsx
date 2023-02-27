import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, {TreeItemProps, treeItemClasses} from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddIcon from '@mui/icons-material/Add';
import {SvgIconProps} from '@mui/material/SvgIcon';
import {Button, Divider} from "@mui/material";
import {Link} from "react-router-dom";

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

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
                <StyledTreeItem nodeId="0" labelIcon={MailIcon} labelText={"My Workspace"}>
                <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon}/>
                <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon}/>
                <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
                    <StyledTreeItem
                        nodeId="5"
                        labelText="Social"
                        labelIcon={SupervisorAccountIcon}
                        labelInfo="90"
                        color="#1a73e8"
                        bgColor="#e8f0fe"
                    />
                    <StyledTreeItem
                        nodeId="6"
                        labelText="Updates"
                        labelIcon={InfoIcon}
                        labelInfo="2,294"
                        color="#e3742f"
                        bgColor="#fcefe3"
                    />
                    <StyledTreeItem
                        nodeId="7"
                        labelText="Forums"
                        labelIcon={ForumIcon}
                        labelInfo="3,566"
                        color="#a250f5"
                        bgColor="#f3e8fd"
                    />
                    <StyledTreeItem
                        nodeId="8"
                        labelText="Promotions"
                        labelIcon={LocalOfferIcon}
                        labelInfo="733"
                        color="#3c8039"
                        bgColor="#e6f4ea"
                    />
                </StyledTreeItem>
                <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label}/>
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