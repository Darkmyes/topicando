import { AdminRecolectionUC } from './src/recolections/usecase/admin_recolection';
import { RecolectionHandler } from './src/recolections/delivery/recolection_http';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { MySQLConnection } from './src/infrastructure/mysql';
import { MySQLRecolectionRepository } from './src/recolections/repository/recolection_mysql';
import { RecolectionUC } from './src/recolections/usecase/recolection';

dotenv.config();

// Database Initialization
let mySQLCon = new MySQLConnection()

// Repositories Initialization
let recolectionRepo = new MySQLRecolectionRepository(mySQLCon)
recolectionRepo.migrate();

// Usecases Initialization
let recolectionUC = new RecolectionUC(recolectionRepo)
let adminRecolectionUC = new AdminRecolectionUC(recolectionRepo)

// API Initialization
const app: Express = express();

// HTTP Delivery Initialization
let recolectionHandler = new RecolectionHandler(recolectionUC, adminRecolectionUC);
recolectionHandler.init(app)

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})