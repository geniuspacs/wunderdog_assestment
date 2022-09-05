import http from 'http';
import { MovementType, Room, RoundResult } from 'rock_types';
import { Server } from "socket.io";
import { determineWinner } from '../utils/utils';
export const MAX_USERS_PER_ROOM = 2;

export default function createSocketServer(httpServer: http.Server): Server {

    const roomsDetails: Map<string, Room> = new Map();
    const roundMovements: Map<string, RoundResult[]> = new Map();

    const socketServer = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5000",
            methods: ["GET", "POST"]
        }
    });

    socketServer.on('connection', (socket) => {
        const handshake = socket.id;

        socket.on('join_room', (data) => {

            if (data?.query?.roomId) {
                const room = socketServer.sockets.adapter.rooms.get(data?.query?.roomId);
                const roomJoined = roomsDetails.get(data?.query?.roomId);

                if (!room || !roomJoined) {
                    socket.emit('error', {
                        msg: 'Room not found'
                    })
                } else {
                    socket.join(data?.query?.roomId);

                    socket.data = {
                        nickname: data?.query?.nickname
                    };

                    roomJoined.isFull = room.size === MAX_USERS_PER_ROOM;

                    socketServer.to(data?.query?.roomId).emit('joined_room', {
                        msg: `Joined at room ${data?.query?.roomId}`,
                        room: roomJoined
                    });
                }
            } else {
                const newRoomId = handshake.substring(0, 4);
                socket.join(newRoomId);

                socket.data = {
                    nickname: data?.query?.nickname
                };

                roomsDetails.set(newRoomId, {
                    roomId: newRoomId,
                    rounds: data?.query?.rounds,
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
            const paused = data.query?.paused;
            const roomId = data.query?.roomId;

            socketServer.to(roomId).emit('paused_game', {
                paused
            })
        });

        socket.on('make_movement', (data: { query: { roomId: string, movement: MovementType } }) => {
            const room = roomsDetails.get(data.query.roomId);

            if (room) {
                if (room?.currentRound === room?.rounds) {
                    socketServer.to(data.query.roomId).emit('error', {
                        msg: `Room ${data.query.roomId} has finished the game`
                    });
                } else {
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
                    } else {
                        const currentRound = currentRegisteredRound.find(round => round.roundId === room.currentRound);
                        if (!currentRound) {
                            currentRegisteredRound.push({
                                roundId: room.currentRound,
                                movements: [{
                                    player: socket.id,
                                    movement: data.query.movement
                                }],
                                winner: ''
                            })
                        } else {
                            currentRound.movements.push({
                                player: socket.id,
                                movement: data.query.movement
                            });

                            if (currentRound.movements.length === MAX_USERS_PER_ROOM) {
                                currentRound.winner = determineWinner(currentRound.movements);

                                if (currentRound.winner) {
                                    const winner = socketServer.sockets.sockets.get(currentRound.winner);

                                    socketServer.to(data.query.roomId).emit('result', {
                                        msg: `${winner?.data.nickname} won the game!`,
                                        winnerId: currentRound.winner
                                    });
                                } else {
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
            } else {
                socketServer.to(data.query.roomId).emit('error', {
                    msg: `Room ${data.query.roomId} not exist.`
                });
            }


        });

        socket.on("game_end", (data: { winnerId: string }) => {
            const socketWinner = socketServer.sockets.sockets.get(data.winnerId);
            console.log("🚀 ~ file: socket.ts ~ line 150 ~ socket.on ~ socketWinner", socketWinner)

            if (socketWinner) {
                console.log("🚀 ~ file: socket.ts ~ line 144 ~ socket.on ~ socketWinner.rooms", socketWinner.rooms);
                // socketServer.to()
            }

        });
    });

    console.log('Socket is listening');

    return socketServer;
}