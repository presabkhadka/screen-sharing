import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function Videocall() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const idInput = useRef<HTMLInputElement>(null);

  const selfPeer = useRef<Peer>();

  // Add url provided by cloudflare tunnel here for port 3000
  const socket = useRef(io("https://belly-cashiers-eh-does.trycloudflare.com"));

  useEffect(() => {
    const peer = new Peer();
    selfPeer.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);

      socket.current.emit("register-peer-id", id);
    });

    peer.on("call", (call) => {
      call.answer();

      call.on("stream", (remoteStream) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStream;
        }
      });
    });

    socket.current.on("peer-id", (id) => {
      setRemotePeerId(id);
    });
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(peerId);
  };

  const handlePasteId = () => {
    navigator.clipboard.readText().then((text) => {
      if (idInput.current) {
        idInput.current.value = text;
      }
    });
  };

  const handleCall = (id: string) => {
    if (!id) return alert("Please enter an ID");

    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((screenStream) => {
        console.log("Screen share recieved");
        const call = selfPeer.current?.call(id, screenStream);

        call?.on("stream", (remoteStream) => {
          if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.error("Error accessing display media.", error);
      });
  };

  useEffect(() => {
    if (remotePeerId) {
      handleCall(remotePeerId);
    }
  }, [remotePeerId]);

  const handleHangup = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-around h-full gap-5 rounded-lg shadow-lg bg-slate-600">
      <video className="w-2/3 rounded-lg" ref={remoteVideo} autoPlay />
      <div className="flex flex-col justify-around h-full gap-2 m-4">
        <div className="flex flex-col gap-2 m-4">
          <h4
            className="text-xl font-bold text-center cursor-pointer animate-bounce"
            onClick={handleCopyId}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCopyId();
            }}
          >
            Your ID:{" "}
            <span title="copy Id" className="text-blue-500">
              {peerId}
            </span>
          </h4>
          <label htmlFor="idInput" className="text-slate-500">
            Receiver ID
          </label>
          <input
            ref={idInput}
            id="idInput"
            type="text"
            onClick={handlePasteId}
            className="h-10 leading-10 border border-gray-500 rounded focus:outline-none "
          />
          <button
            type="button"
            onClick={() => handleCall(idInput.current?.value ?? "")}
            className="h-10 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Share Screen
          </button>
          <button
            type="button"
            className="h-10 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={handleHangup}
          >
            Hang up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Videocall;
