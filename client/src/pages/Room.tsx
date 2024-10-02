import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
    const {id} = useParams();
    const {ws, me} = useContext(RoomContext) || {};

    useEffect(()=>{
       if (me) ws.emit("join-room", {roomId: id, peerId: me._id})
    }, [id]);

  return <div>Room id {id}</div>;
};
