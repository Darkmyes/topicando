import { Category } from "../../domain/category";
import { Postbox, PostboxRepository } from "../../domain/postbox"
import { MySQLConnection } from "../../infrastructure/repository/mysql";

export class PostboxMySQLRepository implements PostboxRepository{
    dBcon: MySQLConnection;

    constructor (dBcon: MySQLConnection) {
        this.dBcon = dBcon;
    }

    async migrate() {
        const createTableQuery = 
            `CREATE TABLE IF NOT EXISTS postboxes (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name TEXT NOT NULL,
                category_id INT NOT NULL REFERENCES categories(id),
                subcategory_id INT NOT NULL REFERENCES subcategories(id)
            ) ENGINE=INNODB;`;

        const createTableResult = await this.dBcon.execute<{ affectedRows: number }>(createTableQuery, []);
    }

    async list() : Promise<Postbox[]>{
        const sqlQuery = "SELECT * FROM postboxes"
        const postboxes = await this.dBcon.execute<{
            id: number,
            name: string,
            category_id: number,
            subcategory_id: number,
        }[]>(sqlQuery, []);

        return postboxes.map(postboxDB => {
            return {
                id: postboxDB.id,
                name: postboxDB.name,
                category: {
                    id: postboxDB.category_id,
                    name: ''
                },
                subcategory: {
                    id: postboxDB.subcategory_id,
                    name: '',
                    category: {
                        id: postboxDB.category_id,
                        name: ''
                    },
                },
            }
        });
    }
    async byID(id: number) : Promise<Postbox | null>{
        const sqlQuery = "SELECT * FROM postboxes WHERE id = ?"
        const postboxDB = await this.dBcon.execute<{
            id: number,
            name: string,
            category_id: number,
            subcategory_id: number,
        }[]>(sqlQuery, [id]);
        if (Object.keys(postboxDB).length == 0) {
            return null
        }
        return {
            id: postboxDB[0].id,
            name: postboxDB[0].name,            
            category: {
                id: postboxDB[0].category_id,
                name: ''
            },
            subcategory: {
                id: postboxDB[0].subcategory_id,
                name: ''
            },
        };
    }
    async byCategoryID(id: number) : Promise<Postbox[]>{
        const sqlQuery = "SELECT * FROM postboxes WHERE category_id = ?"
        const postboxes = await this.dBcon.execute<{
            id: number,
            name: string,
            category_id: number,
            subcategory_id: number,
        }[]>(sqlQuery, [ id ]);

        return postboxes.map(postboxDB => {
            return {
                id: postboxDB.id,
                name: postboxDB.name,
                category: {
                    id: postboxDB.category_id,
                    name: ''
                },
                subcategory: {
                    id: postboxDB.subcategory_id,
                    name: '',
                    category: {
                        id: postboxDB.category_id,
                        name: ''
                    },
                },
            }
        });
    }
    async bySubcategoryID(id: number) : Promise<Postbox[]>{
        const sqlQuery = "SELECT * FROM postboxes WHERE subcategory_id = ?"
        const postboxes = await this.dBcon.execute<{
            id: number,
            name: string,
            category_id: number,
            subcategory_id: number,
        }[]>(sqlQuery, [ id ]);

        return postboxes.map(postboxDB => {
            return {
                id: postboxDB.id,
                name: postboxDB.name,
                category: {
                    id: postboxDB.category_id,
                    name: ''
                },
                subcategory: {
                    id: postboxDB.subcategory_id,
                    name: '',
                    category: {
                        id: postboxDB.category_id,
                        name: ''
                    },
                },
            }
        });
    }
    async register(postbox: Postbox) : Promise<Postbox>{
        let sqlQuery = "INSERT INTO postboxes (name, category_id, subcategory_id) "
        sqlQuery += "VALUES (?,?)"
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            postbox.name,
            postbox.category.id,
            postbox.subcategory.id
        ]);
        postbox.id = result.insertId;
        return postbox
    }
    async update(postbox: Postbox) : Promise<boolean>{
        let sqlQuery = "UPDATE postboxes SET name = ? "
        sqlQuery += "WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            postbox.name,
            postbox.id
        ]);
        return result.affectedRows > 0
    }
    async delete(id: number) : Promise<boolean>{
        const sqlQuery = "DELETE FROM postboxes WHERE id = ?"
        const result = await this.dBcon.execute<{ affectedRows: number }>(sqlQuery, [
            id
        ]);
        return result.affectedRows > 0
    }
}