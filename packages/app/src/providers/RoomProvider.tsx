import React from "react";
import { useState } from "react";
import { Room } from "rock_types";
import io from "socket.io-client";
import { RoomContext } from "../context/RoomContext";

const socketInstance = io(process.env.REACT_APP_SOCKET_API_URL);

const RoomProvider = ({ children }: any) => {
  const [room, setRoom] = useState<Room>({
    currentRound: 0,
    isFull: false,
    roomId: "",
    rounds: 0,
  });

  return (
    <RoomContext.Provider value={{ room, setRoom, socket: socketInstance }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
