export class Role {
    id: number;
    name: string;

    constructor (name: string) {
        this.id = 0;
        this.name = name;
    }
}

export interface RoleRepository {
    list() : Promise<Role[]>;
    byID(id: number) : Promise<Role | null>;
}

export interface RoleUsecase {
    list() : Promise<Role[]>;
}