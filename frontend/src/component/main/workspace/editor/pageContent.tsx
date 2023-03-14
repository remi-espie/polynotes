import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React, {useEffect} from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { generateHTML } from "@tiptap/react";
import { Box } from "@mui/material";
import ColumnExtension from "./column-extension";
import Commands from "./slashCommand-extension/commands";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";

export default function PageContent(props: { row: any[], editable: boolean }) {
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
    ],
    content: generateHTML(props.row, [Document, Paragraph, Text]),
    editable: props.editable
  });

  useEffect(() => {
    editor?.setEditable(props.editable)
  }, [props.editable])

  return (
    <Box sx={{ width: "inherit" }} display="flex" flexDirection="row">
      <Box sx={{ width: "inherit" }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
