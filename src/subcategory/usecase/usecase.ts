import { CategoryRepository } from "../../domain/category";
import { Subcategory, SubcategoryUsecase, SubcategoryRepository } from "../../domain/subcategory"

export class SubcategoryUC implements SubcategoryUsecase {
    subcategoryRepo: SubcategoryRepository;
    categoryRepo: CategoryRepository;

    constructor(subcategoryRepo: SubcategoryRepository, categoryRepo: CategoryRepository) {
        this.subcategoryRepo = subcategoryRepo;
        this.categoryRepo = categoryRepo;
    }

    async list() : Promise<Subcategory[]> {
        let subCategories = await this.subcategoryRepo.list();
        subCategories.forEach(async (subcategory) => {
            let category = await this.categoryRepo.byID(subcategory.category.id)
            if (category != null) {
                subcategory.category = category
            }
        })
        return subCategories;
    }
    async byID(id: number) : Promise<Subcategory | null> {
        let subcategory = await this.subcategoryRepo.byID(id);
        if (subcategory == null) {
            throw new Error("No se encontró la Subcategoría");
        }
        let category = await this.categoryRepo.byID(subcategory.category.id)
        if (category != null) {
            subcategory.category = category
        }
        return subcategory
    }
    async byCategoryID(id: number) : Promise<Subcategory[]> {
        return await this.subcategoryRepo.byCategoryID(id)
    }
    async register(subcategory: Subcategory) : Promise<Subcategory | null> {
        if (subcategory.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        let categoryDB = this.categoryRepo.byID(subcategory.category.id)
        if (categoryDB == null) {
            throw new Error("La categoría asignada no existe");
        }
        return await this.subcategoryRepo.register(subcategory)
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