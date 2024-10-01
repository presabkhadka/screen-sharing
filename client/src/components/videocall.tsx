import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function Videocall() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const idInput = useRef<HTMLInputElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const selfPeer = useRef<Peer>();

  // Add url provided by Cloudflare tunnel here for port 3000
  const socket = useRef(
    io("https://wrapped-cellular-edges-tropical.trycloudflare.com")
  );

  useEffect(() => {
    const peer = new Peer();
    selfPeer.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      socket.current.emit("register-peer-id", id);
    });

    const handleCall = (call: any) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setVideoStream(localVideo, stream);
          call.answer(stream);
          call.on("stream", (remoteStream: any) => {
            setVideoStream(remoteVideo, remoteStream);
          });
        })
        .catch((error) => {
          setError(
            "Error accessing media devices. Please check your permissions."
          );
          console.error("Error accessing media devices.", error);
        });
    };

    peer.on("call", handleCall);

    const handlePeerId = (id: any) => {
      setRemotePeerId(id);
    };

    socket.current.on("peer-id", handlePeerId);

    return () => {
      socket.current.off("peer-id", handlePeerId);
      peer.destroy();
    };
  }, []);

  const setVideoStream = (videoRef: any, stream: any) => {
    if (videoRef.current && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  };

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

  const handleCall = (id: any) => {
    if (!id) return alert("Please enter an ID");

    setLoading(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLoading(false);
        console.log("Screen share received");
        setVideoStream(localVideo, stream);

        const call = selfPeer.current?.call(id, stream);
        call?.on("stream", (remoteStream) => {
          // Only set remote stream if there is a valid remote peer
          if (remotePeerId) {
            setVideoStream(remoteVideo, remoteStream);
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        setError(
          "Error accessing media devices. Please check your permissions."
        );
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
    <div className="flex flex-col justify-around h-screen gap-5 bg-slate-600">
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <video className="rounded-lg" ref={localVideo} autoPlay muted/>
        </div>
        <div className="flex flex-col gap-4">
          {remotePeerId && (
            <video className="rounded-lg" ref={remoteVideo} autoPlay />
          )}
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {loading && (
        <div className="text-yellow-500">Accessing media devices...</div>
      )}
      <div className="flex flex-col justify-around">
        <div className="flex flex-col gap-2">
          <h4
            className="text-xl font-bold cursor-pointer"
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

          <input
            ref={idInput}
            id="idInput"
            type="text"
            onClick={handlePasteId}
            className="border border-gray-500 rounded focus:outline-none p-2 w-fit"
            placeholder="Enter receiver ID here"
          />
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleCall(idInput.current?.value ?? "")}
              className="text-white bg-green-500 rounded-full h-16 w-16 hover:bg-green-600"
              aria-label="Call"
            >
              📞
            </button>
            <button
              type="button"
              className="text-3xl bg-red-500 rounded-full h-16 w-16 hover:bg-red-600"
              onClick={handleHangup}
              aria-label="Hang up"
            >
              📵
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Videocall;
