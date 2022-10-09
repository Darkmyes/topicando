import { Postbox } from "./postbox";
import { User } from "./user";

export class Comment {
    id: number;
    description: string;
    postbox: Postbox;
    user: User;

    constructor (description: string, postbox: Postbox, user: User) {
        this.id = 0;
        this.description = description;
        this.postbox = postbox;
        this.user = user;
    }
}

export interface CommentRepository {
    list() : Promise<Comment[]>;
    byPostboxID(id: number) : Promise<Comment[]>;
    byUserID(id: number) : Promise<Comment[]>;
    byID(id: number) : Promise<Comment | null>;
    register(Comment: Comment) : Promise<Comment>;
    update(Comment: Comment) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface CommentUsecase {
    list() : Promise<Comment[]>;
    byPostboxID(id: number) : Promise<Comment[]>;
    byUserID(id: number) : Promise<Comment[]>;
    byID(id: number) : Promise<Comment | null>;
    register(Comment: Comment) : Promise<Comment>;
    update(Comment: Comment) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}