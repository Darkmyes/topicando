import { Role, RoleRepository } from '../../domain/role';
import { User, UserUsecase, UserRepository } from "../../domain/user"


export class UserUC implements UserUsecase {
    userRepo: UserRepository;
    roleRepo: RoleRepository;

    constructor(userRepo: UserRepository,  roleRepo: RoleRepository) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    async login(username: string, password: string): Promise<User | null> {
        if (username.length == 0) {
            throw new Error("El nombre de usuario es obligatorio")
        }
        if (password.length == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        let user = await this.userRepo.login(username, password)
        if (user == null) {
            throw new Error("Usuario o Contraseña incorrecta")
        }

        let role = await this.roleRepo.byID(user.role.id)
        if (role == null) {
            throw new Error("Error al iniciar sesión, existen problemas con el rol asignado")
        }
        user.role = role

        return user;
    }
    async register(username: string, password: string, role_id: number): Promise<boolean> {
        if (username.length == 0) {
            throw new Error("El nombre de usuario es obligatorio")
        }
        if (password.length == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        if (role_id == 0) {
            throw new Error("El rol es obligatorio")
        }
        return this.userRepo.register(username, password, role_id)
    }
    changePassword(id: number, password: string): Promise<boolean> {
        if (password.length == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        return this.userRepo.changePassword(id, password)
    }
    changeRole(id: number,  role_id: number): Promise<boolean> {
        if (role_id == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        return this.userRepo.changeRole(id, role_id)
    }
}