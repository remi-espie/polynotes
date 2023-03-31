import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React, {useEffect} from "react";
import { Box } from "@mui/material";
import ColumnExtension from "./column-extension";
import Commands from "./slashCommand-extension/commands";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align'
import { useDebounce } from 'use-debounce';
import {JSONContent} from "@tiptap/core";
import {Table} from "@tiptap/extension-table";
import {TableRow} from "@tiptap/extension-table-row";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableCell} from "@tiptap/extension-table-cell";
import {TaskItem} from "@tiptap/extension-task-item";
import {TaskList} from "@tiptap/extension-task-list";

export default function PageContent(props: { row: JSONContent, editable: boolean, setSendPage: (state:boolean) => void, setPageContent:  React.Dispatch<React.SetStateAction<any[]>>, index:number }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ColumnExtension,
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
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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

  const [debouncedEditor] = useDebounce(editor?.state.doc.content, 1000);

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
      <Box sx={{ width: "inherit" }}>
        {editor && <Box sx={{
          visibility: editor.isActive('table') ? 'visible' : 'hidden',
        }}>
          <button
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className={editor.isActive('Insert header') ? 'is-active' : ''}
          >
            Insert header
          </button>

          <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className={editor.isActive('Insert column') ? 'is-active' : ''}
          >
            Insert column
          </button>

          <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className={editor.isActive('Delete column') ? 'is-active' : ''}
          >
            Delete column
          </button>

          <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className={editor.isActive('Insert row') ? 'is-active' : ''}
          >
            Insert row
          </button>

          <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className={editor.isActive('delete row') ? 'is-active' : ''}
          >
            Delete row
          </button>

          <button
              onClick={() => editor.chain().focus().mergeOrSplit().run()}
              className={editor.isActive('Merge or Split') ? 'is-active' : ''}
          >
            Merge or Split
          </button>

          <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className={editor.isActive('Delete table') ? 'is-active' : ''}
          >
            Delete table
          </button>
        </Box>
        }
        <EditorContent editor={editor}/>
      </Box>
  );
}