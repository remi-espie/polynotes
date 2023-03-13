import {ReactRenderer} from "@tiptap/react";
import tippy from "tippy.js";
import CommandsList from "./CommandsList.js";
import React from "react";
import {Range} from "@tiptap/core";
import {Editor} from "@tiptap/core";
import {SuggestionKeyDownProps, SuggestionProps} from "@tiptap/suggestion";

type commandProps = {
    items: [],
    command: (item: any) => void
    onKeyDown(props: { event: { key: string } }): boolean;
}

const renderItems = () => {
    let component: ReactRenderer<commandProps>;
    let popup: any;

    return {
        onStart: (props: SuggestionProps<{
            title: string; command: ({
                                         editor,
                                         range
                                     }: { editor: Editor; range: Range; }) => void;
        }>) => {
            component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor
            });

            popup = tippy("body", {
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start"
            });
            popup[0].setProps({
                getReferenceClientRect: props.clientRect
            });
        },
        onUpdate(props: SuggestionProps<{
            title: string; command: ({
                                         editor,
                                         range
                                     }: { editor: Editor; range: Range; }) => any;
        }>) {
            component.updateProps(props);

            popup[0].setProps({
                getReferenceClientRect: props.clientRect
            });
        },
        onKeyDown(props: SuggestionKeyDownProps) {
            if (props.event.key === "Escape") {
                popup[0].hide();

                return true;
            }

            if (component.ref) return component.ref?.onKeyDown(props);
            else return false;
        },
        onExit() {
            popup[0].destroy();
            component.destroy();
        }
    };
};

export default renderItems;
