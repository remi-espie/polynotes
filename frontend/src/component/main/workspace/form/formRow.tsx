export default class FormRow {
    heading = new formHeading()
    description = new formDescription();
    input: formRow | undefined;

    constructor(type: string) {
        switch (type) {
            case "integer":
                this.input = new formInteger();
                break;
            case "text":
                this.input = new formText();
                break;
            case "paragraph":
                this.input = new formParagraph();
                break
            case "checkbox":
                this.input = new formCheckbox();
                break;
            case "radio":
                this.input = new formRadio();
                break;
            default:
                this.input = new formText();
                break;
        }
    }
}

export interface formRow {
    type: string,
    content: any,
}

class formRadio implements formRow {
    constructor() {
        this.type = "radio";
        this.content = [""];
    }

    type: string;
    content: string[];
}

class formCheckbox implements formRow {
    constructor() {
        this.type = "checkbox";
        this.content = [""];
    }

    type: string;
    content: string[];
}

class formParagraph implements formRow {
    constructor() {
        this.type = "paragraph";
        this.content = "";
    }

    type: string;
    content: string;
}

class formText implements formRow {
    constructor() {
        this.type = "text";
        this.content = "";
    }

    content: any;
    type: string;

}

class formHeading implements formRow {
    constructor() {
        this.type = "heading";
        this.content = "";
    }

    type: string;
    content: string;
}

class formDescription implements formRow {
    constructor() {
        this.type = "description";
        this.content = "";
    }

    content: string;
    type: string;
}

class formInteger implements formRow {
    constructor() {
        this.type = "integer";
        this.content = 0;
    }

    type: string;
    content: number;
}