import { Configuration, ConfigurationRepository } from "../../domain/configuration"
import { MySQLConnection } from "../../infrastructure/repository/mysql";

export class MySQLConfigurationRepository implements ConfigurationRepository{
    dBcon: MySQLConnection;

    constructor (dBcon: MySQLConnection) {
        this.dBcon = dBcon;
    }

    async migrate() {
        const createTableQuery = 
            `CREATE TABLE IF NOT EXISTS configurations (
                max_evidences INT NOT NULL DEFAULT 1,
                primary_color TEXT NOT NULL,
                secondary_color TEXT NOT NULL,
                backgrund_color TEXT NOT NULL,
                toolbar_color TEXT NOT NULL,
                text_color TEXT NOT NULL,
                text_font TEXT NOT NULL,
                text_file TEXT NOT NULL
            ) ENGINE=INNODB;`;
        const createTableResult = await this.dBcon.execute<{ affectedRows: number }>(createTableQuery, []);

        const existsOneSQL = 
            `SELECT COUNT(*) as cont FROM configurations;`;
        const existsOneResult = await this.dBcon.execute<{ cont: number }[]>(existsOneSQL, []);

        if (existsOneResult[0].cont == 0) {
            const createConfigurationsQuery = 
                `INSERT INTO configurations (
                    max_evidences,
                    primary_color,
                    secondary_color,
                    backgrund_color,
                    toolbar_color,
                    text_color,
                    text_font,
                    text_file
                ) VALUES (
                    ?,?,?, ?,?,?, ?,?
                );`;
            const createConfigurationsResult = await this.dBcon.execute<{ affectedRows: number }>(createConfigurationsQuery, [
                1,
                "rgba(6, 254, 120, 0.4)",
                "#06FE78",
                "#ededed",
                "#EFEFEF",
                "black",
                "roboto",
                "rgba(0, 0, 0, 0.6)"
            ]);
        }
    }

    async get() : Promise<Configuration>{
        const sqlQuery = "SELECT * FROM configurations LIMIT 1"
        const configuration = await this.dBcon.execute<Configuration[]>(sqlQuery, []);
        return configuration[0];
    }
    async update(configuration: Configuration) : Promise<boolean>{
        let sqlQuery = 
        `UPDATE configurations SET 
            max_evidences = ?,
            primary_color = ?,
            secondary_color = ?,
            backgrund_color = ?,
            toolbar_color = ?,
            text_color = ?,
            text_font = ?,
            text_file = ?
        `;
        const result = await this.dBcon.execute<{ affectedRows: number, insertId: number }>(sqlQuery, [
            configuration.maxEvidences,
            configuration.primaryColor,
            configuration.secondaryColor,
            configuration.backgrundColor,
            configuration.toolbarColor,
            configuration.textColor,
            configuration.textFont,
            configuration.textFile
        ]);
        if (result.affectedRows == 0) {
            return false
        }
        return true
    }

}