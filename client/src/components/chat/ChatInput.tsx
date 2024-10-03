import React, { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const {sendMessage} = useContext(RoomContext);
  return (
    <div>
      <form onSubmit={(e)=>{
        e.preventDefault();
        sendMessage(message);
        setMessage("");
      }}>
        <div className="flex">
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="border rounded p-2 resize-none mx-2"
          />
          <button
            type="submit"
            className="bg-green-400 p-4 mx-2 rounded text-white hover:bg-green-600 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
