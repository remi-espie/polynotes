import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import React from "react";
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import {generateHTML} from "@tiptap/react";
import {Box} from "@mui/material";

export default function PageContent(props: { row: any[] }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: generateHTML(props.row, [
            Document,
            Paragraph,
            Text,
        ]),
    })

    return (
        <Box sx={{width: "inherit"}}>
            <EditorContent editor={editor}/>
        </Box>
    )
}
