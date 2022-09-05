"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function createSocketServer(httpServer) {
    const socketServer = new socket_io_1.Server(httpServer);
    socketServer.on('connection', (socket) => {
        const handshake = socket.id;
        console.log(`User connected! ${handshake}`);
    });
    console.log('Socket is listening');
    return socketServer;
}
exports.default = createSocketServer;
