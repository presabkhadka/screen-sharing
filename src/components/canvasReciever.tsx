import React, { useRef, useEffect, useState } from "react";

interface DrawingCanvasViewerProps {
  signalingHandler: (offerOrAnswer: any) => void;
}

const DrawingCanvasViewer: React.FC<DrawingCanvasViewerProps> = ({
  signalingHandler,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;

      dataChannel.onmessage = (event) => {
        const drawingData = JSON.parse(event.data);
        handleDrawingData(drawingData);
      };
    };

    const receiveOffer = async (offer: RTCSessionDescriptionInit) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      signalingHandler(answer); // Send the answer back to the sharer
    };

    // Example offer (you will get this from the sharer)
    const copiedOffer: RTCSessionDescriptionInit = {
      type: "offer",
      sdp: "v=0\r\no=- 7223833426501366752 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:BvWn\r\na=ice-pwd:9d9M1STveytEwZAcuAr/PgU+\r\na=ice-options:trickle\r\na=fingerprint:sha-256 07:79:71:FF:4E:6E:3A:E6:47:DD:B7:9F:1A:2E:BA:C2:91:C2:5E:DB:53:3B:9C:80:13:11:B9:3E:37:C3:23:C8\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n",
    };

    // Call receiveOffer to simulate receiving an offer
    receiveOffer(copiedOffer);

    // Setup canvas context
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        setContext(ctx);
      }
    }

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [signalingHandler]); // Add signalingHandler to dependency array

  const handleDrawingData = (data: any) => {
    if (!context) return;

    switch (data.type) {
      case "start":
        context.beginPath();
        context.moveTo(data.x, data.y);
        break;
      case "draw":
        context.lineTo(data.x, data.y);
        context.stroke();
        break;
      case "stop":
        context.closePath();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <canvas
        ref={canvasRef}
        className="border border-black rounded-lg bg-white"
      ></canvas>
    </div>
  );
};

export default DrawingCanvasViewer;
