import { Recolection, RecolectionRepository } from "./../../domain/recolection"
import { MySQLConnection } from "./../../infrastructure/mysql";

export class MySQLRecolectionRepository implements RecolectionRepository{
    dBcon: MySQLConnection;

    constructor (dBcon: MySQLConnection) {
        this.dBcon = dBcon;
    }

    async listOnlyActives() : Promise<Recolection[]> {
        const sqlQuery = "SELECT * FROM recolections where is_active"
        const recolections = await this.dBcon.execute<Recolection[]>(sqlQuery, []);
        return recolections;
    }
    async byIDOnlyActives(id: number) : Promise<Recolection | null>{
        const sqlQuery = "SELECT * FROM recolections WHERE id = ? AND is_active"
        const recolection = await this.dBcon.execute<Recolection>(sqlQuery, [id]);
        return recolection;
    }

    async list() : Promise<Recolection[]>{
        const sqlQuery = "SELECT * FROM recolections"
        const recolections = await this.dBcon.execute<Recolection[]>(sqlQuery, []);
        return recolections;
    }
    async byID(id: number) : Promise<Recolection | null>{
        const sqlQuery = "SELECT * FROM recolections WHERE id = ?"
        const recolection = await this.dBcon.execute<Recolection>(sqlQuery, [id]);
        return recolection;
    }
    async register(recolection: Recolection) : Promise<Recolection>{
        let sqlQuery = "INSERT INTO recolections (name, is_active) "
        sqlQuery += "VALUES (?,?)"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            recolection.name,
            recolection.isActive
        ]);
        recolection.id = result.insertId;
        return recolection
    }
    async update(recolection: Recolection) : Promise<boolean>{
        let sqlQuery = "UPDATE recolections SET name = ?, is_active = ? "
        sqlQuery += "WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            recolection.name,
            recolection.isActive,
            recolection.id
          ]);
        return result.affectedRows > 0
    }
    async delete(id: number) : Promise<boolean>{
        const sqlQuery = "DELETE FROM recolections WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            id
          ]);
        return result.affectedRows > 0
    }
}