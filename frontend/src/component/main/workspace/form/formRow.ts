export default class FormRow {
    heading: formRow = {type: "heading", content: ""};
    description: formRow = {type: "description", content: ""};
    input: formRow;

    constructor(type: string) {
        switch (type) {
            case "integer":
                this.input = {type: "integer", content: 0};
                break;
            case "text":
                this.input = {type: "text", content: ""};
                break;
            case "paragraph":
                this.input = {type: "paragraph", content: ""};
                break
            case "checkbox":
                this.input = {type: "checkbox", content: [""]};
                break;
            case "radio":
                this.input = {type: "radio", content: [""]};
                break;
            default:
                this.input = {type: "text", content: ""};
                break;
        }
    }
}

export type formRow = {
    type: string,
    content: any,
}