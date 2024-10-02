import Peer from "peerjs";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
const WS = "http://localhost:3000";
import {v4 as uuidV4} from 'uuid';

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export const RoomProvider: React.FC = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>()
  const enterRoom = ({ roomId }: { roomId: "string" }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`)
  };

  const getUsers = ({participants}: {participants: string[]}) => { 
    console.log({participants});
    
  }

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);
    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers)
  });
  return <RoomContext.Provider value={{ ws, me }}>{children}</RoomContext.Provider>;
};
