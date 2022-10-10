import { Category } from "./category";
import { Subcategory } from "./subcategory";

export class Postbox {
    id: number;
    name: string;
    category: Category;
    subcategory: Subcategory;

    constructor (name: string, category: Category, subcategory: Subcategory) {
        this.id = 0;
        this.name = name;
        this.category = category;
        this.subcategory = subcategory;
    }
}

export interface PostboxRepository {
    list() : Promise<Postbox[]>;
    byCategoryID(id: number) : Promise<Postbox[]>;
    bySubcategoryID(id: number) : Promise<Postbox[]>;
    byID(id: number) : Promise<Postbox | null>;
    register(Postbox: Postbox) : Promise<Postbox>;
    update(Postbox: Postbox) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface PostboxUsecase {
    list() : Promise<Postbox[]>;
    byCategoryID(id: number) : Promise<Postbox[]>;
    bySubcategoryID(id: number) : Promise<Postbox[]>;
    byID(id: number) : Promise<Postbox | null>;
    register(Postbox: Postbox) : Promise<Postbox | null>;
    update(Postbox: Postbox) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}