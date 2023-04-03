import {CommandProps, mergeAttributes, Node} from '@tiptap/core'
import {ReactNodeViewRenderer} from '@tiptap/react'
import activeTableComponent from "./databaseComponent";


declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        activeTable: {
            addTable: () => ReturnType;
        };
    }
}


export default Node.create({
    name: 'activeTableComponent',

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
                tag: 'active-table',
            },
        ]
    },

    renderHTML({HTMLAttributes}) {
        return ['active-table', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(activeTableComponent)
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
                    tr = tr.insert(selection.$to.pos, doc.type.schema.node('activeTableComponent', {content: [["Your table"], []], type: true}));
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