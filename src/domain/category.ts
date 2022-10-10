export class Category {
    id: number;
    name: string;

    constructor (name: string) {
        this.id = 0;
        this.name = name;
    }
}

export interface CategoryRepository {
    list() : Promise<Category[]>;
    byID(id: number) : Promise<Category | null>;

    register(category: Category) : Promise<Category | null>;
    update(category: Category) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface CategoryUsecase {
    list() : Promise<Category[]>;

    register(category: Category) : Promise<Category | null>;
    update(category: Category) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}