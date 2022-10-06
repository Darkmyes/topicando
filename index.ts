import { ConfigurationHandler } from './src/configuration/delivery/configuration_http';
import { ConfigurationUC } from './src/configuration/usecase/configuration';
import { MySQLConfigurationRepository } from './src/configuration/repository/configuration_mysql';
import { UserHandler } from './src/user/delivery/user_http';
import { UserUC } from './src/user/usecase/user';
import { MySQLUserRepository } from './src/user/repository/user_mysql';
import { AdminRecolectionUC } from './src/recolection/usecase/admin_recolection';
import { RecolectionHandler } from './src/recolection/delivery/recolection_http';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import { MySQLConnection } from './src/infrastructure/mysql';
import { MySQLRecolectionRepository } from './src/recolection/repository/recolection_mysql';
import { RecolectionUC } from './src/recolection/usecase/recolection';
import { MySQLRoleRepository } from './src/role/repository/role_mysql';

dotenv.config();

// Database Initialization
let mySQLCon = new MySQLConnection();

// Repositories Initialization
let configurationRepo = new MySQLConfigurationRepository(mySQLCon);
configurationRepo.migrate();

let rolRepo = new MySQLRoleRepository(mySQLCon);
rolRepo.migrate();

let userRepo = new MySQLUserRepository(mySQLCon);
userRepo.migrate();

let recolectionRepo = new MySQLRecolectionRepository(mySQLCon);
recolectionRepo.migrate();


// Usecases Initialization
let configurationUC = new ConfigurationUC(configurationRepo)

let recolectionUC = new RecolectionUC(recolectionRepo);
let adminRecolectionUC = new AdminRecolectionUC(recolectionRepo);

let userUC = new UserUC(userRepo, rolRepo);

// API Initialization
const app: Express = express();

// HTTP Delivery Initialization
let configurationHandler = new ConfigurationHandler(configurationUC)
configurationHandler.init(app);

let recolectionHandler = new RecolectionHandler(recolectionUC, adminRecolectionUC);
recolectionHandler.init(app);

let userHandler = new UserHandler(userUC);
userHandler.init(app);

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})