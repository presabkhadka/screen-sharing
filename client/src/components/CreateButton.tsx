import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { NameInput } from "../common/Name";

export const Join: React.FC = () => {
  const { ws } = useContext(RoomContext);
  const createRoom = () => {
    ws.emit("create-room");
  };
  return (
    <div className="flex flex-col">
    <NameInput/>
    <button
      onClick={createRoom}
      className="bg-blue-400 p-2 rounded-lg text-xl text-white hover:bg-blue-600"
    >
      Start new meeting
    </button>
    </div>
  );
};
