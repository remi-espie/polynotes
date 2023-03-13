import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { generateHTML } from "@tiptap/react";
import { Box } from "@mui/material";
import ColumnExtension from "../../../column-extension";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

export default function PageContent(props: { row: any[] }) {
  const editor = useEditor({
    extensions: [StarterKit, ColumnExtension],
    content: generateHTML(props.row, [Document, Paragraph, Text]),
  });

  return (
    <Box sx={{ width: "inherit" }} display="flex" flexDirection="row">
      <Box sx={{ width: "inherit" }}>
        <EditorContent editor={editor} />
      </Box>
      <Box display="flex" flexDirection="column" alignSelf="center">
        <IconButton
          aria-label={"add column here"}
          size={"small"}
          color={"primary"}
          sx={{ height: 32, width: 32 }}
          onClick={() => {
              const pos = editor!.view.state.selection.from
              if (editor!.view.domAtPos(pos).node !== null && (editor!.view.domAtPos(pos).node.parentNode!.classList.contains("column"))) {
                  editor!.chain().focus().insertColumns().run();
              }
              else editor!.chain().focus().setColumns(2).run();
          }}
        >
          <ViewColumnIcon />
        </IconButton>
        <IconButton
          aria-label={"Delete columns"}
          size={"small"}
          color={"warning"}
          sx={{ height: 32, width: 32 }}
          onClick={() => {
              const pos = editor!.view.state.selection.from
              if (editor!.view.domAtPos(pos).node !== null && editor!.view.domAtPos(pos).node.parentNode!.classList.contains("column")) {
                  const nbColumn = editor!.view.domAtPos(pos).node.parentNode!.parentNode!.children.length
                  if (nbColumn>2) {
                      editor!.chain().focus().unsetColumns().setColumns(nbColumn - 1).run()
                  }
                  else editor!.chain().focus().unsetColumns().run();
              }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
