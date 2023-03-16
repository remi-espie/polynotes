export type userType = {
    id: string,
    nickname: string,
    email: string,
    validated: boolean,
    createdAt: string,
}

export type workspaceType = {
    id: string;

    owner: string;

    reader: string[];

    writer: string[];

    modified: Date;

    type: string;

    name: string;

    parentId: string;

    subContent: string
}