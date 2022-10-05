import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { MySQLConnection } from './src/infrastructure/mysql';
import { MySQLRecolectionRepository } from './src/recolections/repository/recolection_mysql';
import { RecolectionUC } from './src/recolections/usecase/recolection';

dotenv.config();

// Database Initialization
let mySQlCon = new MySQLConnection()

// Repositories Initialization
let recolectionRepo = new MySQLRecolectionRepository(mySQlCon)

// Usecases Initialization
let recolectionUC = new RecolectionUC(recolectionRepo)

// API Initialization
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

// HTTP Delivery Initialization

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})