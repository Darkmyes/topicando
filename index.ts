import fs from 'fs';
import dotenv from 'dotenv';

import { MySQLConnection } from './src/infrastructure/repository/mysql';
import { HttpAPI } from './src/infrastructure/delivery/http';

import { MySQLConfigurationRepository } from './src/configuration/repository/mysql';
import { ConfigurationHandler } from './src/configuration/delivery/http';
import { ConfigurationUC } from './src/configuration/usecase/usecase';

import { MySQLRoleRepository } from './src/role/repository/mysql';
import { RoleHandler } from './src/role/delivery/http';
import { RoleUC } from './src/role/usecase/usecase';

import { MySQLUserRepository } from './src/user/repository/mysql';
import { UserHandler } from './src/user/delivery/http';
import { UserUC } from './src/user/usecase/usecase';

import { MySQLCategoryRepository } from './src/category/repository/mysql';
import { CategoryHandler } from './src/category/delivery/http';
import { CategoryUC } from './src/category/usecase/usecase';

import { MySQLSubcategoryRepository } from './src/subcategory/repository/mysql';
import { SubcategoryHandler } from './src/subcategory/delivery/http';
import { SubcategoryUC } from './src/subcategory/usecase/usecase';

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

let categoryRepo = new MySQLCategoryRepository(mySQLCon);
categoryRepo.migrate();

let subcategoryRepo = new MySQLSubcategoryRepository(mySQLCon);
subcategoryRepo.migrate();


// Usecases Initialization
let configurationUC = new ConfigurationUC(configurationRepo)

let roleUC = new RoleUC(rolRepo)

let userUC = new UserUC(userRepo, rolRepo);

let categoryUC = new CategoryUC(categoryRepo);

let subcategoryUC = new SubcategoryUC(subcategoryRepo, categoryRepo);


// API Initialization
var privateKey  = fs.readFileSync('certs/server.key', 'utf8');
var certificate = fs.readFileSync('certs/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const port = 3000;

const httpAPI = new HttpAPI(port, credentials)


// HTTP Delivery Initialization
let configurationHandler = new ConfigurationHandler(configurationUC)
httpAPI.addHandler(configurationHandler);

let roleHandler = new RoleHandler(roleUC)
httpAPI.addHandler(roleHandler);

let userHandler = new UserHandler(userUC);
httpAPI.addHandler(userHandler);

let categoryHandler = new CategoryHandler(categoryUC);
httpAPI.addHandler(categoryHandler);

let subcategoryHandler = new SubcategoryHandler(subcategoryUC);
httpAPI.addHandler(subcategoryHandler);


// RUN HTTP API
httpAPI.run();
