import cors from 'cors';
import express, { Application } from "express";
import http from 'http';
import path from 'path';
import createSocketServer from "./socket/socket";

export default function createServer(): http.Server {
    const app: Application = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../../app/build')));

    const server = http.createServer(app);

    createSocketServer(server);

    return server;
}

