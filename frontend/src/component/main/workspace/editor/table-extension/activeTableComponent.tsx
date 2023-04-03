import {NodeViewWrapper} from "@tiptap/react";
import {ActiveTable} from "active-table-react";

export default (props: { node: { attrs: { content: (string | number)[][] | undefined; }; }; }) => {

    return (
        <NodeViewWrapper className="active-table">
            <ActiveTable contentEditable={true} content={props.node.attrs.content} />
        </NodeViewWrapper>
    )
}