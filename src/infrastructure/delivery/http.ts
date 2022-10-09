import fs from 'fs';
import dotenv from 'dotenv';
import https from 'https';
import express, { Express } from 'express';
import cors from 'cors';

interface HttpHandler{
    init(app: Express): void
}

interface SSLCredentials{
    key: string
    cert: string
}

export class HttpAPI {
    app: Express;
    credentials: SSLCredentials | null;
    port: number;

    constructor (port: number, credentials: SSLCredentials | null = null) {
        const app: Express = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors({ origin: '*' }));

        this.app = app;
        this.port = port;
        this.credentials = credentials;
    }

    addHandler (handler: HttpHandler) {
        handler.init(this.app);
    }

    run() {
        if (this.credentials != null) {
            https.createServer(this.credentials, this.app).listen(3000, () => {
                console.log(`Example app listening on port ${this.port}`);
            });
            return;
        }
        
        this.app.listen(3000, () => {
            console.log(`Example app listening on port ${this.port}`);
        })
    }
}