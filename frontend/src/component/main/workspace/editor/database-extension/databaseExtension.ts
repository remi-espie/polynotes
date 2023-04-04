import {CommandProps, mergeAttributes, Node} from '@tiptap/core'
import {ReactNodeViewRenderer} from '@tiptap/react'
import databaseComponent from "./databaseComponent";


declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        activeTable: {
            addTable: () => ReturnType;
        };
    }
}


export default Node.create({
    name: 'databaseComponent',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            content: {
                default: [],
            },
            type: {
                default: true,
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'database-extension',
            },
        ]
    },

    renderHTML({HTMLAttributes}) {
        return ['database-extension', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(databaseComponent)
    },


    addCommands() {

        const insertTable = () =>
            ({tr, dispatch}: CommandProps) => {
                try {
                    const {doc, selection} = tr;
                    if (!dispatch) {
                        console.log('no dispatch');
                        return;
                    }
                    tr = tr.insert(selection.$to.pos, doc.type.schema.node('databaseComponent', {content: [["Your table"], []], type: true}));
                    return dispatch(tr);
                } catch (error) {
                    console.error(error);
                }
            };


        return {
            addTable: insertTable,
        };
    },

})