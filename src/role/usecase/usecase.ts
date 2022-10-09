import { Role, RoleRepository, RoleUsecase } from '../../domain/role';


export class RoleUC implements RoleUsecase {
    roleRepo: RoleRepository;

    constructor(roleRepo: RoleRepository) {
        this.roleRepo = roleRepo;
    }

    async list(): Promise<Role[]> {
        return await this.roleRepo.list()
    }

}