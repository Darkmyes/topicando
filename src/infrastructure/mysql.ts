import { createPool, Pool } from 'mysql';

export class MySQLConnection {
    pool: Pool;

    /**
     * generates pool connection to be used throughout the app
     */
    constructor() {
        try {
            this.pool = createPool({
                connectionLimit: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 4,
                host: process.env.MY_SQL_DB_HOST,
                user: process.env.MY_SQL_DB_USER,
                password: process.env.MY_SQL_DB_PASSWORD,
                database: process.env.MY_SQL_DB_DATABASE,
                port: process.env.MY_SQL_DB_PORT ? parseInt(process.env.MY_SQL_DB_PORT) : 4
            });

            console.debug('MySql Adapter Pool generated successfully');
        } catch (error) {
            console.error('[mysql.connector][init][Error]: ', error);
            throw new Error('failed to initialized pool');
        }
    }

    /**
     * executes SQL queries in MySQL db
     *
     * @param {string} query - provide a valid SQL query
     * @param {string[] | Object} params - provide the parameterized values used
     * in the query
     */
    execute = <T>(query: string, params: string[] | Object): Promise<T> => {
        try {
            if (!this.pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');

            return new Promise<T>((resolve, reject) => {
                this.pool.query(query, params, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });

        } catch (error) {
            console.error('[mysql.connector][execute][Error]: ', error);
            throw new Error('failed to execute MySQL query');
        }
    }
}



