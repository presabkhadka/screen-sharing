import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

function Videocall() {
  const [peerId, setPeerId] = useState("");

  const selfVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const idInput = useRef<HTMLInputElement>(null);

  const selfPeer = useRef<Peer>();

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });

    selfPeer.current = peer;

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((selfStream) => {
          if (selfVideo.current) selfVideo.current.srcObject = selfStream;

          call.answer(selfStream);

          call.on("stream", (remoteStream) => {
            if (remoteVideo.current)
              remoteVideo.current.srcObject = remoteStream;
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });
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
    if (!id) return alert("Please enter an id");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((selfStream) => {
        if (selfVideo.current) selfVideo.current.srcObject = selfStream;

        const call = selfPeer.current?.call(id, selfStream);

        call?.on("stream", (remoteStream) => {
          console.log(remoteStream);

          if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  };

  const handleHangup = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-around h-screen gap-5 bg-custom-gradient">
      <video
        className="w-1/4 h-fit  rounded-lg"
        ref={remoteVideo}
        autoPlay
        poster="https://upload.wikimedia.org/wikipedia/commons/6/6c/Phone_icon.png"
      />
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
            Call
          </button>
          <button
            type="button"
            className="h-10 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={handleHangup}
          >
            Hang up
          </button>
        </div>
        <video className="h-64 m-2 rounded-lg" ref={selfVideo} muted autoPlay />
      </div>
    </div>
  );
}

export default Videocall;
