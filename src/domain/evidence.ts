import { Comment } from "./comment";

export class Evidence {
    id: number;
    urlImage: string;
    comment: Comment;

    constructor (urlImage: string, comment: Comment) {
        this.id = 0;
        this.urlImage = urlImage;
        this.comment = comment;
    }
}

export interface EvidenceRepository {
    list() : Promise<Evidence[]>;
    byCommentID(id: number) : Promise<Evidence[]>;
    byID(id: number) : Promise<Evidence | null>;
    register(Evidence: Evidence) : Promise<Evidence>;
    update(Evidence: Evidence) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface EvidenceUsecase {
    list() : Promise<Evidence[]>;
    byCommentID(id: number) : Promise<Evidence[]>;
    byID(id: number) : Promise<Evidence | null>;
    register(Evidence: Evidence) : Promise<Evidence>;
    update(Evidence: Evidence) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}