import { User, UserRepository } from "../../domain/user"
import { MySQLConnection } from "../../infrastructure/repository/mysql";

export class MySQLUserRepository implements UserRepository{
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
                role_id INT NOT NULL REFERENCES roles(id)
            ) ENGINE=INNODB;`;

        const createTableResult = await this.dBcon.execute<{ affectedRows: number }>(createTableQuery, []);
    }

    async login(username: string, password: string) : Promise<User | null>{
        const sqlQuery = "SELECT * FROM users WHERE usernam = ? AND password = ?"
        const userDB = await this.dBcon.execute<{id: number, username: string, password: string, role_id: number}[]>(sqlQuery, [username, password]);
        if (Object.keys(userDB).length == 0) {
            return null
        }

        return {
            username: userDB[0].username,
            password: userDB[0].password,
            role: {id: userDB[0].role_id, name: ""}
        } as User;
    }
    async register(username: string, password: string, role_id: number) : Promise<boolean>{
        let sqlQuery = "INSERT INTO users (username, password, role_id)"
        sqlQuery += "VALUES (?,?,?)"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            username,
            password,
            role_id
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
    async changeRole(id: number, role_id: number): Promise<boolean> {
        let sqlQuery = "UPDATE users SET role_id = ? "
        sqlQuery += "WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            role_id,
            id
        ]);
        if (result.affectedRows == 0) {
            return false
        }
        return true
    }
}