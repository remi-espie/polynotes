import {NodeViewWrapper} from "@tiptap/react";
import {ActiveTable} from "active-table-react";
import React, {useState} from "react";
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from "@mui/material/IconButton";
import {Box} from "@mui/material";

export default (props: { node: { attrs: { content: (string | number)[][] | undefined; type: boolean }; }; }) => {

    const [viewTable, setViewTable] = useState<boolean>(props.node.attrs.type)


    return (
        <NodeViewWrapper className="active-table">
            <Box display='flex'>
            <IconButton
                aria-label={"Change view type"}
                size={"small"}
                color={"primary"}
                sx={{
                    height: 32,
                    width: 32,
                }}
                onClick={() => {
                    setViewTable(!viewTable)
                }}
            >
                <CachedIcon />
            </IconButton>
            {viewTable ? <ActiveTable contentEditable={true} content={props.node.attrs.content} /> : null }
            </Box>
        </NodeViewWrapper>
    )
}