const getSuggestionItems = (query) => {
    return [
        {
            title: "H1",
            command: ({editor, range}) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", {level: 1})
                    .run();
            }
        },
        {
            title: "H2",
            command: ({editor, range}) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", {level: 2})
                    .run();
            }
        },
        {
            title: "H3",
            command: ({editor, range}) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", {level: 3})
                    .run();
            }
        },
        {
            title: "H4",
            command: ({editor, range}) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", {level: 4})
                    .run();
            }
        },
        {
            title: "H5",
            command: ({editor, range}) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", {level: 5})
                    .run();
            }
        },
        {
            title: "Paragraph",
            command: ({editor, range}) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("paragraph")
                    .run();
            }
        },
        {
            title: "Column",
            command: ({editor, range}) => {
                const pos = editor.view.state.selection.from
                if (editor.view.domAtPos(pos).node !== null && (editor.view.domAtPos(pos).node.parentNode.classList.contains("column"))) {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertColumns()
                        .run();
                } else {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setColumns(2)
                        .run();
                }
            }
        },
        {
            title: "bold",
            command: ({editor, range}) => {
                editor.chain().focus().deleteRange(range).setMark("bold").run();
            }
        },
        {
            title: "italic",
            command: ({editor, range}) => {
                editor.chain().focus().deleteRange(range).setMark("italic").run();
            }
        },
        {
            title: "image",
            command: ({editor, range}) => {
                console.log("call some function from parent");
                editor.chain().focus().deleteRange(range).setNode("paragraph").run();
            }
        }
    ]
        .filter((item) => item.title.toLowerCase().startsWith(query.query.toLowerCase()))
        .slice(0, 10);
};

export default getSuggestionItems;
