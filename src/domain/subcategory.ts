
export class Subcategory {
    id: number;
    name: string;

    constructor (name: string) {
        this.id = 0;
        this.name = name;
    }
}

export interface SubcategoryRepository {
    list() : Promise<Subcategory[]>;
    byCategoryID(id: number) : Promise<Subcategory[]>;
    byID(id: number) : Promise<Subcategory | null>;

    register(Subcategory: Subcategory, categoryID: number) : Promise<Subcategory | null>;
    update(Subcategory: Subcategory) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface SubcategoryUsecase {
    byCategoryID(id: number) : Promise<Subcategory[]>;

    register(Subcategory: Subcategory, categoryID: number) : Promise<Subcategory | null>;
    update(Subcategory: Subcategory) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}