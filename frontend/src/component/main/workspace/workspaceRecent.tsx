import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { Folder } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function WorkspaceRecent(props: { workspaces: [] }) {

  const workspaces = props.workspaces.sort((a, b) => {
    return new Date(b.modified) - new Date(a.modified);
  });

  console.log(workspaces)

  return (
    <ImageList gap={8} sx={{
      height: 200,
      gridAutoFlow: "column",
      gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr)) !important",
      gridAutoColumns: "minmax(200px, 1fr)"
    }}>
      {workspaces.map((workspace) => (
        <ImageListItem key={workspace._id}>
          {workspace.type ==="folder" ? <Folder /> : <DescriptionIcon />}
          <ImageListItemBar
            title={workspace.name}

          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}