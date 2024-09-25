import React, { useRef, useState, useEffect } from "react";

interface CanvasSharerProps {
  signalingHandler: (offerOrAnswer: any) => void;
}

const CanvasSharer: React.FC<CanvasSharerProps> = ({ signalingHandler }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isOfferSent, setIsOfferSent] = useState(false);

  useEffect(() => {
    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    const dataChannel = peerConnection.createDataChannel("canvasData");
    dataChannelRef.current = dataChannel;

    dataChannel.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.reset) {
        handleReset();
      } else if (data.drawing) {
        handleRemoteDraw(data.x, data.y);
      }
    };

    const createOffer = async () => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      signalingHandler(offer); // Send the offer to the viewer
      setIsOfferSent(true);
      console.log("Share this offer with the viewer:", JSON.stringify(offer));
    };

    createOffer();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(
          "Send this ICE candidate to the viewer:",
          JSON.stringify(event.candidate)
        );
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === "connected") {
        console.log("Peer connection established.");
      }
    };

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        setContext(ctx);
      }
    }
  }, []);

  const handleReset = () => {
    if (canvasRef.current && context) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (
        dataChannelRef.current &&
        dataChannelRef.current.readyState === "open"
      ) {
        dataChannelRef.current.send(JSON.stringify({ reset: true }));
      }
    }
  };

  const drawing = (e: React.MouseEvent) => {
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context) return;

    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();

    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === "open"
    ) {
      dataChannelRef.current.send(
        JSON.stringify({
          drawing: true,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
        })
      );
    }
  };

  const stopDrawing = () => {
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const handleRemoteDraw = (x: number, y: number) => {
    if (context) {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const receiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      if (isOfferSent) {
        await peerConnectionRef.current?.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        signalingHandler(answer);
        console.log("Received answer from viewer:", answer);
      } else {
        console.error("Offer not sent yet, cannot set remote description.");
      }
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  };

  const onReceiveAnswer = (answer: RTCSessionDescriptionInit) => {
    receiveAnswer(answer);
  };

  onReceiveAnswer({
    type: "answer",
    sdp: "v=0\r\no=- 1874333149653405619 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:U/90\r\na=ice-pwd:PydqyKF+0dkOJFAQRiI+WYk6\r\na=ice-options:trickle\r\na=fingerprint:sha-256 95:22:89:EE:D5:F9:07:FC:AD:AE:0D:18:F7:24:F3:AD:13:3F:0C:16:FC:51:DC:D5:F9:BF:07:6D:22:CF:1A:38\r\na=setup:active\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n",
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <canvas
        ref={canvasRef}
        onMouseDown={drawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-black rounded-lg bg-white"
      ></canvas>
      <button
        className="px-4 py-2 bg-custom-gradient rounded-lg hover:text-white hover:animate-pulse"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default CanvasSharer;
