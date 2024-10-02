import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const Join: React.FC = () => {
  const { ws } = useContext(RoomContext);
  const createRoom = () => {
    ws.emit("create-room");
  };
  return (
    <button
      onClick={createRoom}
      className="bg-rose-400 px-4 py-2 rounded-lg text-xl text-white hover:bg-rose-600"
    >
      Start new meeting
    </button>
  );
};
