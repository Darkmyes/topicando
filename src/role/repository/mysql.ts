import { Role, RoleRepository } from "../../domain/role"
import { MySQLConnection } from "../../infrastructure/repository/mysql";

export class MySQLRoleRepository implements RoleRepository{
    dBcon: MySQLConnection;

    constructor (dBcon: MySQLConnection) {
        this.dBcon = dBcon;
    }

    async migrate() {
        const createTableQuery = 
            `CREATE TABLE IF NOT EXISTS roles (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name TEXT NOT NULL
            ) ENGINE=INNODB;`;

        const createTableResult = await this.dBcon.execute<{ affectedRows: number }>(createTableQuery, []);

        const existsOneSQL = 
            `SELECT COUNT(*) as cont FROM roles;`;
        const existsOneResult = await this.dBcon.execute<{ cont: number }[]>(existsOneSQL, []);

        if (existsOneResult[0].cont == 0) {
            const createRolesQuery = 
                `INSERT INTO roles (
                    name
                ) VALUES (
                    ?
                );`;
            const createAdminRoleResult = await this.dBcon.execute<{ affectedRows: number }>(createRolesQuery, [
                "Admin",
            ]);
            const createCommonRoleResult = await this.dBcon.execute<{ affectedRows: number }>(createRolesQuery, [
                "Común",
            ]);
        }
    }

    async list() : Promise<Role[]>{
        const sqlQuery = "SELECT * FROM roles"
        const roles = await this.dBcon.execute<Role[]>(sqlQuery, []);
        return roles;
    }
    async byID(id: number) : Promise<Role | null>{
        const sqlQuery = "SELECT * FROM roles WHERE id = ?"
        const role = await this.dBcon.execute<Role>(sqlQuery, [id]);
        if (Object.keys(role).length == 0) {
            return null
        }
        return role;
    }
}