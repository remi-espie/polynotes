export type userType = {
    _id: string,
    nickname: string,
    email: string,
    validated: boolean,
    createdAt: string,
}

export type workspaceType = {
    _id: string;

    owner: string;

    reader: string[];

    writer: string[];

    modified: Date;

    type: string;

    name: string;

    parentId: string;

    subContent: string
}