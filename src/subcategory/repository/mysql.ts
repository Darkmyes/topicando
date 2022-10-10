import { Category } from "../../domain/category";
import { Subcategory, SubcategoryRepository } from "../../domain/subcategory"
import { MySQLConnection } from "../../infrastructure/repository/mysql";

export class MySQLSubcategoryRepository implements SubcategoryRepository{
    dBcon: MySQLConnection;

    constructor (dBcon: MySQLConnection) {
        this.dBcon = dBcon;
    }

    async migrate() {
        const createTableQuery = 
            `CREATE TABLE IF NOT EXISTS subcategories (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name TEXT NOT NULL,
                category_id INT NOT NULL REFERENCES categories(id)
            ) ENGINE=INNODB;`;

        const createTableResult = await this.dBcon.execute<{ affectedRows: number }>(createTableQuery, []);
    }

    async list() : Promise<Subcategory[]>{
        const sqlQuery = "SELECT * FROM subcategories"
        const subcategories = await this.dBcon.execute<{
            id: number,
            name: string,
            category_id: number,
        }[]>(sqlQuery, []);

        return subcategories.map(subcategoryDB => {
            return {
                id: subcategoryDB.id,
                name: subcategoryDB.name,
            }
        });
    }
    async byID(id: number) : Promise<Subcategory | null>{
        const sqlQuery = "SELECT * FROM subcategories WHERE id = ?"
        const subcategoryDB = await this.dBcon.execute<{
            id: number,
            name: string,
            category_id: number,
        }[]>(sqlQuery, [id]);
        if (Object.keys(subcategoryDB).length == 0) {
            return null
        }
        return {
            id: subcategoryDB[0].id,
            name: subcategoryDB[0].name
        };
    }
    async byCategoryID(id: number) : Promise<Subcategory[]>{
        const sqlQuery = "SELECT * FROM subcategories WHERE category_id = ?"
        const subcategories = await this.dBcon.execute<{
            id: number,
            name: string,
            category_id: number,
        }[]>(sqlQuery, [ id ]);

        return subcategories.map(subcategoryDB => {
            return {
                id: subcategoryDB.id,
                name: subcategoryDB.name
            }
        });
    }
    async register(subcategory: Subcategory, categoryID: number) : Promise<Subcategory>{
        let sqlQuery = "INSERT INTO subcategories (name, category_id) "
        sqlQuery += "VALUES (?,?)"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            subcategory.name,
            categoryID
        ]);
        subcategory.id = result.insertId;
        return subcategory
    }
    async update(subcategory: Subcategory) : Promise<boolean>{
        let sqlQuery = "UPDATE subcategories SET name = ? "
        sqlQuery += "WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            subcategory.name,
            subcategory.id
        ]);
        return result.affectedRows > 0
    }
    async delete(id: number) : Promise<boolean>{
        const sqlQuery = "DELETE FROM subcategories WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            id
        ]);
        return result.affectedRows > 0
    }
}