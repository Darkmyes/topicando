export class User {
    id: number;
    username: string;
    password: string;

    constructor (username: string, password: string) {
        this.id = 0;
        this.username = username;
        this.password = password;
    }
}

export interface UserRepository {
    login(username: string, password: string) : Promise<User>;
    register(username: string, password: string) : Promise<boolean>;
}

export interface UserUsecase {
    login(username: string, password: string) : Promise<User>;
    register(username: string, password: string) : Promise<boolean>;
}