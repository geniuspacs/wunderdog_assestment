import React from "react";
import { useState } from "react";
import io from "socket.io-client";
import { RoomContext } from "../context/RoomContext";

const socketInstance = io();

const RoomProvider = ({ children }: any) => {
  const [room, setRoom] = useState();

  return (
    <RoomContext.Provider value={{ room, setRoom, socket: socketInstance }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
