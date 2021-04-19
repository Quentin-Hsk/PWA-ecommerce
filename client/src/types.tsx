export interface IUser {
    _id: string,
    alias: string,
    mail?: string,
    phone?: string,
    avatarURL: string
}

export interface IComment {
    _id: string,
    author: IUser,
    text: string
}

export interface IFeed {
    _id: string,
    author: IUser,
    avatarURL: string,
    source: string,
    miniature: string,
    description: string,
    keywords: Array<string>,
    mentions: Array<IUser>,
    comments: Array<IComment>
    likes: Array<ILike>
}

export interface ILike {
    _id: string,
    alias: string,
    firstName: string,
    lastName: string,
    mail: string,
}

export interface INotif {
    createdAt: string,
    to: string,
    from: IUser,
    image: IFeed,
    type: string
}

export enum Size {
    SMALL,
    LARGE
}