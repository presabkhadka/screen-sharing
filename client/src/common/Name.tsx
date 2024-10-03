import React, { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const NameInput: React.FC = ({}) => {
    const {userName, setUserName} = useContext(RoomContext);
  return (
    <input
      className="border-2 rounded-lg outline-none p-2 my-2 focus:border-blue-500"
      placeholder="Enter your username"
      onChange={(e)=>setUserName(e.target.value)}
      value={userName}
    />
  );
};
