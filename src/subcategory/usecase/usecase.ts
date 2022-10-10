import { CategoryRepository } from "../../domain/category";
import { Subcategory, SubcategoryUsecase, SubcategoryRepository } from "../../domain/subcategory"

export class SubcategoryUC implements SubcategoryUsecase {
    subcategoryRepo: SubcategoryRepository;
    categoryRepo: CategoryRepository;

    constructor(subcategoryRepo: SubcategoryRepository, categoryRepo: CategoryRepository) {
        this.subcategoryRepo = subcategoryRepo;
        this.categoryRepo = categoryRepo;
    }

    async byCategoryID(id: number) : Promise<Subcategory[]> {
        return await this.subcategoryRepo.byCategoryID(id)
    }
    async register(subcategory: Subcategory, categoryID: number) : Promise<Subcategory | null> {
        if (subcategory.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        let categoryDB = this.categoryRepo.byID(categoryID)
        if (categoryDB == null) {
            throw new Error("La categoría asignada no existe");
        }
        return await this.subcategoryRepo.register(subcategory, categoryID)
    }
    async update(subcategory: Subcategory) : Promise<boolean> {
        let subcategoryDB = this.subcategoryRepo.byID(subcategory.id)
        if (subcategoryDB == null) {
            throw new Error("No se encontró la Subcategoría");
        }

        if (subcategory.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        return await this.subcategoryRepo.update(subcategory)
    }
    async delete(id: number) : Promise<boolean> {
        return await this.subcategoryRepo.delete(id)
    }
}