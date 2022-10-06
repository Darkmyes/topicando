import { Role } from "./role";
export class User {
    id: number;
    username: string;
    password: string;
    role: Role;

    constructor (username: string, password: string, role: Role) {
        this.id = 0;
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

export interface UserRepository {
    login(username: string, password: string) : Promise<User | null>;
    register(username: string, password: string, role_id: number) : Promise<boolean>;
    changeRole(id: number, role_id: number) : Promise<boolean>;
    changePassword(id: number, password: string) : Promise<boolean>;
}

export interface UserUsecase {
    login(username: string, password: string) : Promise<User | null>;
    register(username: string, password: string, role_id: number) : Promise<boolean>;
    changeRole(id: number, role_id: number) : Promise<boolean>;
    changePassword(id: number, password: string) : Promise<boolean>;
}