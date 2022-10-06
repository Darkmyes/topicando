export class User {
    id: number;
    username: string;
    password: string;
    rol: string;

    constructor (username: string, password: string, rol: string) {
        this.id = 0;
        this.username = username;
        this.password = password;
        this.rol = rol;
    }
}

export interface UserRepository {
    login(username: string, password: string) : Promise<User | null>;
    register(username: string, password: string, rol: string) : Promise<boolean>;
    changeRol(id: number, rol: string) : Promise<boolean>;
    changePassword(id: number, password: string) : Promise<boolean>;
}

export interface UserUsecase {
    login(username: string, password: string) : Promise<User | null>;
    register(username: string, password: string, rol: string) : Promise<boolean>;
    changeRol(id: number, rol: string) : Promise<boolean>;
    changePassword(id: number, password: string) : Promise<boolean>;
}