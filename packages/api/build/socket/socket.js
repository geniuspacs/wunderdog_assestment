"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_USERS_PER_ROOM = void 0;
const socket_io_1 = require("socket.io");
const utils_1 = require("../utils/utils");
exports.MAX_USERS_PER_ROOM = 2;
function createSocketServer(httpServer) {
    const roomsDetails = new Map();
    const roundMovements = new Map();
    const socketServer = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    socketServer.on('connection', (socket) => {
        const handshake = socket.id;
        socket.on('join_room', (data) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            if ((_a = data === null || data === void 0 ? void 0 : data.query) === null || _a === void 0 ? void 0 : _a.roomId) {
                const room = socketServer.sockets.adapter.rooms.get((_b = data === null || data === void 0 ? void 0 : data.query) === null || _b === void 0 ? void 0 : _b.roomId);
                const roomJoined = roomsDetails.get((_c = data === null || data === void 0 ? void 0 : data.query) === null || _c === void 0 ? void 0 : _c.roomId);
                if (!room || !roomJoined) {
                    socket.emit('error', {
                        msg: 'Room not found'
                    });
                }
                else {
                    socket.join((_d = data === null || data === void 0 ? void 0 : data.query) === null || _d === void 0 ? void 0 : _d.roomId);
                    socket.data = {
                        nickname: (_e = data === null || data === void 0 ? void 0 : data.query) === null || _e === void 0 ? void 0 : _e.nickname
                    };
                    roomJoined.isFull = room.size === exports.MAX_USERS_PER_ROOM;
                    socketServer.to((_f = data === null || data === void 0 ? void 0 : data.query) === null || _f === void 0 ? void 0 : _f.roomId).emit('joined_room', {
                        msg: `Joined at room ${(_g = data === null || data === void 0 ? void 0 : data.query) === null || _g === void 0 ? void 0 : _g.roomId}`,
                        room: roomJoined
                    });
                }
            }
            else {
                const newRoomId = handshake.substring(0, 4);
                socket.join(newRoomId);
                socket.data = {
                    nickname: (_h = data === null || data === void 0 ? void 0 : data.query) === null || _h === void 0 ? void 0 : _h.nickname
                };
                roomsDetails.set(newRoomId, {
                    roomId: newRoomId,
                    rounds: (_j = data === null || data === void 0 ? void 0 : data.query) === null || _j === void 0 ? void 0 : _j.rounds,
                    currentRound: 0,
                    isFull: false
                });
                roundMovements.set(newRoomId, []);
                socket.emit('joined_room', {
                    msg: `Welcome to room ${newRoomId}`,
                    room: roomsDetails.get(newRoomId)
                });
            }
        });
        socket.on('pause_game', (data) => {
            var _a, _b;
            const paused = (_a = data.query) === null || _a === void 0 ? void 0 : _a.paused;
            const roomId = (_b = data.query) === null || _b === void 0 ? void 0 : _b.roomId;
            socketServer.to(roomId).emit('paused_game', {
                paused
            });
        });
        socket.on('make_movement', (data) => {
            const room = roomsDetails.get(data.query.roomId);
            if (room) {
                if ((room === null || room === void 0 ? void 0 : room.currentRound) === (room === null || room === void 0 ? void 0 : room.rounds)) {
                    socketServer.to(data.query.roomId).emit('error', {
                        msg: `Room ${data.query.roomId} has finished the game`
                    });
                }
                else {
                    const currentRegisteredRound = roundMovements.get(data.query.roomId);
                    if (!currentRegisteredRound) {
                        roundMovements.set(data.query.roomId, [{
                                roundId: room.currentRound || 1,
                                movements: [{
                                        player: socket.id,
                                        movement: data.query.movement
                                    }],
                                winner: ''
                            }]);
                    }
                    else {
                        const currentRound = currentRegisteredRound.find(round => round.roundId === room.currentRound);
                        if (!currentRound) {
                            currentRegisteredRound.push({
                                roundId: room.currentRound,
                                movements: [{
                                        player: socket.id,
                                        movement: data.query.movement
                                    }],
                                winner: ''
                            });
                        }
                        else {
                            currentRound.movements.push({
                                player: socket.id,
                                movement: data.query.movement
                            });
                            if (currentRound.movements.length === exports.MAX_USERS_PER_ROOM) {
                                currentRound.winner = (0, utils_1.determineWinner)(currentRound.movements);
                                if (currentRound.winner) {
                                    const winner = socketServer.sockets.sockets.get(currentRound.winner);
                                    socketServer.to(data.query.roomId).emit('result', {
                                        msg: `${winner === null || winner === void 0 ? void 0 : winner.data.nickname} won the game!`,
                                        winnerId: currentRound.winner
                                    });
                                }
                                else {
                                    socketServer.to(data.query.roomId).emit('result', {
                                        msg: `Draw!`,
                                        winnerId: currentRound.winner
                                    });
                                }
                                room.currentRound += 1;
                            }
                        }
                    }
                }
            }
            else {
                socketServer.to(data.query.roomId).emit('error', {
                    msg: `Room ${data.query.roomId} not exist.`
                });
            }
        });
        socket.on("game_end", (data) => {
            const socketWinner = socketServer.sockets.sockets.get(data.winnerId);
            console.log("🚀 ~ file: socket.ts ~ line 150 ~ socket.on ~ socketWinner", socketWinner);
            if (socketWinner) {
                console.log("🚀 ~ file: socket.ts ~ line 144 ~ socket.on ~ socketWinner.rooms", socketWinner.rooms);
                // socketServer.to()
            }
        });
    });
    console.log('Socket is listening');
    return socketServer;
}
exports.default = createSocketServer;
