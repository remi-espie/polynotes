import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import {Editor} from "@tiptap/core";
import {Range} from "@tiptap/core";
import getSuggestionItems from "./items";
import renderItems from "./renderItems";

const Commands = Extension.create({
    name: "mention",

    defaultOptions: {
        suggestion: {
            char: "/",
            startOfLine: false,
            command: ({ editor, range, props } : {editor: Editor, range: Range, props: any}) => {
                props.command({ editor, range, props });
            }
        }
    },

    addProseMirrorPlugins: function () {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
                items: getSuggestionItems,
                render: renderItems,
            })
        ];
    }
});

export default Commands;
