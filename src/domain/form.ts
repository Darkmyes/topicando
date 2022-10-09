import { Category } from "./category";
import { Subcategory } from "./subcategory";

export class Form {
    id: number;
    name: string;
    isActive: boolean;
    dateCreated: string;
    category: Category;
    subcategory: Subcategory;

    constructor (name: string, isActive: boolean, dateCreated: string, category: Category, subcategory: Subcategory) {
        this.id = 0;
        this.name = name;
        this.isActive = isActive;
        this.dateCreated = dateCreated;
        this.category = category;
        this.subcategory = subcategory;
    }
}

export interface FormRepository {
    listOnlyActives() : Promise<Form[]>;
    byCategoryIDOnlyActives(id: number) : Promise<Form[]>;
    bySubcategoryIDOnlyActives(id: number) : Promise<Form[]>;
    byIDOnlyActives(id: number) : Promise<Form | null>;

    list() : Promise<Form[]>;
    byCategoryID(id: number) : Promise<Form[]>;
    bySubcategoryID(id: number) : Promise<Form[]>;
    byID(id: number) : Promise<Form | null>;

    register(Form: Form) : Promise<Form>;
    update(Form: Form) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface AdminFormUsecase {
    list() : Promise<Form[]>;
    byCategoryID(id: number) : Promise<Form[]>;
    bySubcategoryID(id: number) : Promise<Form[]>;
    byID(id: number) : Promise<Form | null>;

    register(Form: Form) : Promise<Form>;
    update(Form: Form) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface FormUsecase {
    list() : Promise<Form[]>;
    byCategoryID(id: number) : Promise<Form[]>;
    bySubcategoryID(id: number) : Promise<Form[]>;
    byID(id: number) : Promise<Form | null>;
}