import { Category } from "./category";

export class Subcategory {
    id: number;
    name: string;
    category: Category;

    constructor (name: string, category: Category) {
        this.id = 0;
        this.name = name;
        this.category = category;
    }
}

export interface SubcategoryRepository {
    list() : Promise<Subcategory[]>;
    byCategoryID(id: number) : Promise<Subcategory[]>;
    byID(id: number) : Promise<Subcategory | null>;
    register(Subcategory: Subcategory) : Promise<Subcategory | null>;
    update(Subcategory: Subcategory) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface SubcategoryUsecase {
    list() : Promise<Subcategory[]>;
    byCategoryID(id: number) : Promise<Subcategory[]>;
    byID(id: number) : Promise<Subcategory | null>;
    register(Subcategory: Subcategory) : Promise<Subcategory | null>;
    update(Subcategory: Subcategory) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}