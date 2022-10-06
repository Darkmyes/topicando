export class Recolection {
    id: number;
    name: string;
    isActive: boolean;

    constructor (name: string,) {
        this.id = 0
        this.name = name;
        this.isActive = true;
    }
}

export interface RecolectionRepository {
    listOnlyActives() : Promise<Recolection[]>;
    byIDOnlyActives(id: number) : Promise<Recolection | null>;

    list() : Promise<Recolection[]>;
    byID(id: number) : Promise<Recolection | null>;
    register(recolection: Recolection) : Promise<Recolection>;
    update(recolection: Recolection) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface AdminRecolectionUsecase {
    list() : Promise<Recolection[]>;
    byID(id: number) : Promise<Recolection | null>;
    register(recolection: Recolection) : Promise<Recolection | null>;
    update(recolection: Recolection, id: number) : Promise<boolean>;
    delete(id: number) : Promise<boolean>;
}

export interface RecolectionUsecase {
    list() : Promise<Recolection[]>;
    byID(id: number) : Promise<Recolection | null>;
}