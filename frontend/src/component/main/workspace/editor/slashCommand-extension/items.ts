import { Editor, Range } from "@tiptap/core";

const getSuggestionItems = (query: { query: string }) => {
  return [
    {
      title: "H1",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "H2",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "H3",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "H4",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 4 })
          .run();
      },
    },
    {
      title: "H5",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 5 })
          .run();
      },
    },
    {
      title: "Paragraph",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
    },
    {
      title: "Column",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        const pos = editor.view.state.selection.from;
        if (
          editor.view.domAtPos(pos).node !== null &&
          (
            editor.view.domAtPos(pos).node!.parentNode! as HTMLElement
          ).classList.contains("column")
        ) {
          editor.chain().focus().deleteRange(range).insertColumns().run();
        } else {
          editor.chain().focus().deleteRange(range).setColumns(2).run();
        }
      },
    },
    {
      title: "Delete column",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).unsetColumns().run();
      },
    },
    {
      title: "HR",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: "Bold",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setMark("bold").run();
      },
    },
    {
      title: "Italic",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "Underline",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleUnderline().run();
      },
    },
    {
      title: "Align Left",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setTextAlign('left').run();
      },
    },
    {
      title: "Align Center",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setTextAlign('center').run();
      },
    },
    {
      title: "Align Right",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setTextAlign('right').run();
      },
    },
    {
      title: "Justify",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setTextAlign('justify').run();
      },
    },
    {
      title: "Strike",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleStrike().run();
      },
    },
    {
      title: "Subscript",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleSubscript().run();
      },
    },
    {
      title: "Superscript",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleSuperscript().run();
      },
    },
    {
      title: "Image",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        const url = window.prompt("URL");

        if (url) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setImage({ src: url })
            .run();
        }
      },
    },
    {
      title: "Table",
      command: ({editor, range}: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).addTable().run();
      },
    },
    {
      title: "Checkbox",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
  ].filter((item) =>
    item.title.toLowerCase().startsWith(query.query.toLowerCase())
  );
};

export default getSuggestionItems;