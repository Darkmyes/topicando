import { User, UserUsecase, UserRepository } from "./../../domain/user"

export class UserUC implements UserUsecase {
    userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    login(username: string, password: string): Promise<User | null> {
        if (username.length == 0) {
            throw new Error("El nombre de usuario es obligatorio")
        }
        if (password.length == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        return this.userRepo.login(username, password)
    }
    register(username: string, password: string, rol: string): Promise<boolean> {
        if (username.length == 0) {
            throw new Error("El nombre de usuario es obligatorio")
        }
        if (password.length == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        if (rol.length == 0) {
            throw new Error("La rol es obligatorio")
        }
        return this.userRepo.register(username, password, rol)
    }
    changePassword(id: number, password: string): Promise<boolean> {
        if (password.length == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        return this.userRepo.changePassword(id, password)
    }
    changeRol(id: number, rol: string): Promise<boolean> {
        if (rol.length == 0) {
            throw new Error("La contraseña es obligatoria")
        }
        return this.userRepo.changeRol(id, rol)
    }
}