import { RoleHandler } from './src/role/delivery/role_http';
import { RoleUC } from './src/role/usecase/role';
import { ConfigurationHandler } from './src/configuration/delivery/configuration_http';
import { ConfigurationUC } from './src/configuration/usecase/configuration';
import { MySQLConfigurationRepository } from './src/configuration/repository/configuration_mysql';
import { UserHandler } from './src/user/delivery/user_http';
import { UserUC } from './src/user/usecase/user';
import { MySQLUserRepository } from './src/user/repository/user_mysql';
import { AdminRecolectionUC } from './src/recolection/usecase/admin_recolection';
import { RecolectionHandler } from './src/recolection/delivery/recolection_http';
import { MySQLConnection } from './src/infrastructure/mysql';
import { MySQLRecolectionRepository } from './src/recolection/repository/recolection_mysql';
import { RecolectionUC } from './src/recolection/usecase/recolection';
import { MySQLRoleRepository } from './src/role/repository/role_mysql';
import cors from 'cors';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

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

let roleUC = new RoleUC(rolRepo)

let recolectionUC = new RecolectionUC(recolectionRepo);
let adminRecolectionUC = new AdminRecolectionUC(recolectionRepo);

let userUC = new UserUC(userRepo, rolRepo);

// API Initialization
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: '*' }));

// HTTP Delivery Initialization
let configurationHandler = new ConfigurationHandler(configurationUC)
configurationHandler.init(app);

let roleHandler = new RoleHandler(roleUC)
roleHandler.init(app)

let recolectionHandler = new RecolectionHandler(recolectionUC, adminRecolectionUC);
recolectionHandler.init(app);

let userHandler = new UserHandler(userUC);
userHandler.init(app);


var privateKey  = fs.readFileSync('certs/server.key', 'utf8');
var certificate = fs.readFileSync('certs/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const port = 3000;

https.createServer(credentials, app).listen(3000,() => {
    console.log(`Example app listening on port ${port}`);
});
