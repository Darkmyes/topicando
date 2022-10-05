import { Recolection, RecolectionUsecase, RecolectionRepository } from "./../../domain/recolection"

export class RecolectionUC implements RecolectionUsecase {
    
    recolectionRepo: RecolectionRepository;
    
    constructor(recolectionRepo: RecolectionRepository) {
        this.recolectionRepo = recolectionRepo;
    }

    async list() : Promise<Recolection[]> {
        return await this.recolectionRepo.listOnlyActives()
    }
    async byID(id: number) : Promise<Recolection | null> {
        return await this.recolectionRepo.byIDOnlyActives(id)
    }
}