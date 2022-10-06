import { Recolection, AdminRecolectionUsecase, RecolectionRepository } from "./../../domain/recolection"

export class AdminRecolectionUC implements AdminRecolectionUsecase {
    
    recolectionRepo: RecolectionRepository;
    
    constructor(recolectionRepo: RecolectionRepository) {
        this.recolectionRepo = recolectionRepo;
    }

    async list() : Promise<Recolection[]> {
        return await this.recolectionRepo.list()
    }
    async byID(id: number) : Promise<Recolection | null> {
        return await this.recolectionRepo.byID(id)
    }
    async register(recolection: Recolection) : Promise<Recolection | null> {
        if (recolection.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        return await this.recolectionRepo.register(recolection)
    }
    async update(recolection: Recolection, id: number) : Promise<boolean> {
        let recolectionDB = this.recolectionRepo.byID(id)
        if (recolectionDB == null) {
            throw new Error("No se encontró la Recolección");
        }

        if (recolection.name.trim().length == 0) {
            throw new Error("El nombre no puede estar vacío");
        }
        return await this.recolectionRepo.update(recolection)
    }
    async delete(id: number) : Promise<boolean> {
        return await this.recolectionRepo.delete(id)
    }
}