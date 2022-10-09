import { Category, CategoryUsecase, CategoryRepository } from "../../domain/category"

export class CategoryUC implements CategoryUsecase {
    categoryRepo: CategoryRepository;

    constructor(categoryRepo: CategoryRepository) {
        this.categoryRepo = categoryRepo;
    }

    async list() : Promise<Category[]> {
        return await this.categoryRepo.list()
    }
    async byID(id: number) : Promise<Category | null> {
        let category = await this.categoryRepo.byID(id)
        if (category == null) {
            throw new Error("No se encontró la Categoría");
        }
        return category
    }
    async register(category: Category) : Promise<Category | null> {
        if (category.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        return await this.categoryRepo.register(category)
    }
    async update(category: Category) : Promise<boolean> {
        let categoryDB = this.categoryRepo.byID(category.id)
        if (categoryDB == null) {
            throw new Error("No se encontró la Categoría");
        }

        if (category.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        return await this.categoryRepo.update(category)
    }
    async delete(id: number) : Promise<boolean> {
        return await this.categoryRepo.delete(id)
    }
}