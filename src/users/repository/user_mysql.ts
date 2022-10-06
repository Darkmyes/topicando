import { User, UserRepository } from "./../../domain/user"
import { MySQLConnection } from "./../../infrastructure/mysql";

export class MySQLuserRepository implements UserRepository{
    dBcon: MySQLConnection;

    constructor (dBcon: MySQLConnection) {
        this.dBcon = dBcon;
    }

    async migrate() {
        const createTableQuery = 
            `CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                rol TEXT NOT NULL,
            );`;

        const createTableResult = await this.dBcon.execute<{ affectedRows: number }>(createTableQuery, []);
    }

    async login(username: string, password: string) : Promise<User | null>{
        const sqlQuery = "SELECT * FROM users WHERE usernam = ? AND password = ?"
        const user = await this.dBcon.execute<User>(sqlQuery, [username, password]);
        if (Object.keys(user).length == 0) {
            return null
        }
        return user;
    }
    async register(username: string, password: string, rol: string) : Promise<boolean>{
        let sqlQuery = "INSERT INTO users (username, password) "
        sqlQuery += "VALUES (?,?)"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            username,
            password,
            rol
        ]);
        if (result.affectedRows == 0) {
            return false
        }
        return true
    }
    async changePassword(id: number, password: string): Promise<boolean> {
        let sqlQuery = "UPDATE users SET password = ? "
        sqlQuery += "WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            password,
            id
        ]);
        if (result.affectedRows == 0) {
            return false
        }
        return true
    }
    async changeRol(id: number, rol: string): Promise<boolean> {
        let sqlQuery = "UPDATE users SET rol = ? "
        sqlQuery += "WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            rol,
            id
        ]);
        if (result.affectedRows == 0) {
            return false
        }
        return true
    }
}