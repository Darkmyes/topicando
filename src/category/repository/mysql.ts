import { Category, CategoryRepository } from "../../domain/category"
import { MySQLConnection } from "../../infrastructure/repository/mysql";

export class MySQLCategoryRepository implements CategoryRepository{
    dBcon: MySQLConnection;

    constructor (dBcon: MySQLConnection) {
        this.dBcon = dBcon;
    }

    async migrate() {
        const createTableQuery = 
            `CREATE TABLE IF NOT EXISTS categories (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name TEXT NOT NULL
            ) ENGINE=INNODB;`;

        const createTableResult = await this.dBcon.execute<{ affectedRows: number }>(createTableQuery, []);
    }

    async list() : Promise<Category[]>{
        const sqlQuery = "SELECT * FROM categories"
        const categories = await this.dBcon.execute<Category[]>(sqlQuery, []);
        return categories;
    }
    async byID(id: number) : Promise<Category | null>{
        const sqlQuery = "SELECT * FROM categories WHERE id = ?"
        const category = await this.dBcon.execute<Category[]>(sqlQuery, [id]);
        if (Object.keys(category).length == 0) {
            return null
        }
        return category[0];
    }
    async register(category: Category) : Promise<Category>{
        let sqlQuery = "INSERT INTO categories (name) "
        sqlQuery += "VALUES (?,?)"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            category.name
        ]);
        category.id = result.insertId;
        return category
    }
    async update(category: Category) : Promise<boolean>{
        let sqlQuery = "UPDATE categories SET name = ? "
        sqlQuery += "WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            category.name,
            category.id
        ]);
        return result.affectedRows > 0
    }
    async delete(id: number) : Promise<boolean>{
        const sqlQuery = "DELETE FROM categories WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            id
        ]);
        return result.affectedRows > 0
    }
}