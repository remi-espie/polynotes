import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import React, {useEffect} from "react";
import {Box} from "@mui/material";
import ColumnExtension from "./column-extension";
import Commands from "./slashCommand-extension/commands";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Underline} from "@tiptap/extension-underline";
import {Subscript} from "@tiptap/extension-subscript";
import {Superscript} from "@tiptap/extension-superscript";
import {Image} from "@tiptap/extension-image";
import {Link} from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align'
import {useDebounce} from 'use-debounce';
import {JSONContent} from "@tiptap/core";
import {TaskItem} from "@tiptap/extension-task-item";
import {TaskList} from "@tiptap/extension-task-list";
import tableExtension from "./database-extension/databaseExtension";

export default function PageContent(props: { row: JSONContent, editable: boolean, setSendPage: (state: boolean) => void, setPageContent: React.Dispatch<React.SetStateAction<any[]>>, index: number }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            ColumnExtension,
            tableExtension,
            Underline,
            Subscript,
            Superscript,
            Commands,
            Image,
            Link.configure({
                protocols: ["ftp", "mailto", "tel"],
            }),
            Placeholder.configure({
                placeholder: "A new story begins...",
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: props.row,
        editable: props.editable
    });

    useEffect(() => {
        editor?.setEditable(props.editable)
    }, [props.editable])

    const [debouncedEditor] = useDebounce(editor?.getHTML(), 1000);

    useEffect(() => {
        if (debouncedEditor) {
            props.setPageContent((prev) => {
                let newContent = prev
                newContent[props.index] = editor!.getJSON()
                return newContent
            })
            props.setSendPage(true)
        }
    }, [debouncedEditor]);


    return (
        <Box sx={{width: "inherit"}}>
            <EditorContent editor={editor}/>
        </Box>
    );
}