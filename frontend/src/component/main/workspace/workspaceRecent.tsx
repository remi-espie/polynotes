import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import {useNavigate} from "react-router-dom";
import {workspaceType} from "../../../types";
import {Folder} from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function WorkspaceRecent(props: { workspaces: workspaceType[] }) {

    // const workspaces = props.workspaces.sort((a: workspaceType, b: workspaceType) => {
    //     return new Date(b.modified).getTime() - new Date(a.modified).getTime();
    // });

    const navigate = useNavigate()


    return (
        <ImageList gap={8} sx={{
            height: 150,
            gridAutoFlow: "column",
            gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr)) !important",
            gridAutoColumns: "minmax(150px, 1fr)",
            overflowX: "scroll",
            overflowY: "hidden",
        }}>
            {props.workspaces.map((workspace: workspaceType) => (
                <ImageListItem sx={{cursor: "pointer", height:"calc(100% - 25px) !important"}} key={workspace.id} onClick={() => {
                    if (workspace.type === "folder") {
                        navigate(`/home/folder/${workspace.id}`)
                    } else {
                        navigate(`/home/page/${workspace.id}`)
                    }
                }
                }>
                    {workspace.type === "folder" ?
                        <Folder sx={{ height:"100%", width:"100%"}}/>
                        :
                        <DescriptionIcon sx={{ height:"100%", width:"100%"}}/>
                    }
                    <ImageListItemBar
                        title={workspace.name}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}