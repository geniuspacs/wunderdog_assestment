"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_USERS_PER_ROOM = void 0;
const socket_io_1 = require("socket.io");
exports.MAX_USERS_PER_ROOM = 2;
function createSocketServer(httpServer) {
    const roomsDetails = new Map();
    const socketServer = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: [
                "GET",
                "POST"
            ]
        }
    });
    socketServer.on('connection', (socket) => {
        const handshake = socket.id;
        socket.on('join_room', ({ query }) => {
            const { nickname, roomId, rounds } = query;
            if (roomId) {
                const room = socketServer.sockets.adapter.rooms.get(roomId);
                const roomJoined = roomsDetails.get(roomId);
                if (!room || !roomJoined) {
                    socket.emit('error', {
                        msg: 'Room not found'
                    });
                }
                else {
                    socket.join(roomId);
                    socket.data = {
                        nickname
                    };
                    socket.emit('joined_room', {
                        msg: `Welcome to room ${roomId}`
                    });
                    roomJoined.isFull = room.size === exports.MAX_USERS_PER_ROOM;
                }
            }
            else {
                socket.join(roomId);
                socket.data = {
                    nickname
                };
                roomsDetails.set(roomId, {
                    roomId,
                    rounds,
                    currentRound: 0,
                    isFull: false
                });
                socket.emit('joined_room', {
                    msg: `Welcome to room ${roomId}`
                });
            }
        });
    });
    console.log('Socket is listening');
    return socketServer;
}
exports.default = createSocketServer;
