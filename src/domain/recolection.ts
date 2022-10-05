export class Recolection {
    id: number;
    name: string;
    isActive: boolean;

    constructor (name: string,) {
            this.name = name;
        }
}

export interface RecolectionRepository {
    list(name: string, password: string) : Recolection[];
    byID(name: string, password: string) : Recolection;
    listOnlyActives(name: string, password: string) : Recolection[];
    byIDOnlyActives(name: string, password: string) : Recolection;
    register(username: string, password: string) : Recolection;
    update() : boolean;
    delete(id) : boolean;
}

export interface RecolectionUsecase {
    login(username: string, password: string) : Recolection;
    register(username: string, password: string) : boolean;
}