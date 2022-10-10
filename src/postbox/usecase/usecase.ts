import { CategoryRepository } from "../../domain/category";
import { SubcategoryRepository } from "../../domain/subcategory";
import { Postbox, PostboxUsecase, PostboxRepository } from "../../domain/postbox"

export class PostboxUC implements PostboxUsecase {
    postboxRepo: PostboxRepository;
    categoryRepo: CategoryRepository;
    subcategoryRepo: SubcategoryRepository;

    constructor(postboxRepo: PostboxRepository, categoryRepo: CategoryRepository, subcategoryRepo: SubcategoryRepository) {
        this.postboxRepo = postboxRepo;
        this.categoryRepo = categoryRepo;
        this.subcategoryRepo = subcategoryRepo;
    }

    async list() : Promise<Postbox[]> {
        let postboxes = await this.postboxRepo.list();
        postboxes.forEach(async (postbox) => {
            let category = await this.categoryRepo.byID(postbox.category.id)
            if (category != null) {
                postbox.category = category
            }
            let subcategory = await this.subcategoryRepo.byID(postbox.subcategory.id)
            if (subcategory != null) {
                postbox.subcategory = subcategory
            }
        })
        return postboxes;
    }
    async byID(id: number) : Promise<Postbox | null> {
        let postbox = await this.postboxRepo.byID(id);
        if (postbox == null) {
            throw new Error("No se encontró el buzón");
        }
        let category = await this.categoryRepo.byID(postbox.category.id)
        if (category != null) {
            postbox.category = category
        }
        let subcategory = await this.subcategoryRepo.byID(postbox.subcategory.id)
        if (subcategory != null) {
            postbox.subcategory = subcategory
        }
        return postbox
    }
    async byCategoryID(id: number) : Promise<Postbox[]> {
        return await this.postboxRepo.byCategoryID(id)
    }
    async bySubcategoryID(id: number) : Promise<Postbox[]> {
        return await this.postboxRepo.bySubcategoryID(id)
    }
    async register(postbox: Postbox) : Promise<Postbox | null> {
        if (postbox.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        let categoryDB = this.categoryRepo.byID(postbox.category.id)
        if (categoryDB == null) {
            throw new Error("La categoría asignada no existe");
        }
        let subcategoryDB = this.subcategoryRepo.byID(postbox.subcategory.id)
        if (subcategoryDB == null) {
            throw new Error("La subcategoría asignada no existe");
        }
        return await this.postboxRepo.register(postbox)
    }
    async update(postbox: Postbox) : Promise<boolean> {
        let postboxDB = this.postboxRepo.byID(postbox.id)
        if (postboxDB == null) {
            throw new Error("No se encontró el buzón");
        }

        if (postbox.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        return await this.postboxRepo.update(postbox)
    }
    async delete(id: number) : Promise<boolean> {
        return await this.postboxRepo.delete(id)
    }
}