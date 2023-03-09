import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import {useNavigate} from "react-router-dom";
import {workspaceType} from "../../../types";

export default function WorkspaceRecent(props: { workspaces: workspaceType[] }) {

    const workspaces = props.workspaces.sort((a: workspaceType, b: workspaceType) => {
        return new Date(b.modified).getTime() - new Date(a.modified).getTime();
    });

    const navigate = useNavigate()

    const folder = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path fill='white' d=\"M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z\"/></svg>"

    const description = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path fill='white' d=\"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z\"/></svg>"

    return (
        <ImageList gap={8} sx={{
            height: 150,
            gridAutoFlow: "column",
            gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr)) !important",
            gridAutoColumns: "minmax(150px, 1fr)",
            overflowX: "scroll",
            overflowY: "hidden",
        }}>
            {workspaces.map((workspace: workspaceType) => (
                <ImageListItem sx={{cursor: "pointer"}} key={workspace._id} onClick={() => {
                    if (workspace.type === "folder") {
                        navigate(`/home/folder/${workspace._id}`)
                    } else {
                        navigate(`/home/page/${workspace._id}`)
                    }
                }
                }>
                    <img src={workspace.type === "folder" ? folder : description} alt={workspace.type}/>
                    <ImageListItemBar
                        title={workspace.name}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}