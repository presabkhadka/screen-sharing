import React, { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const socket = useRef<Socket | null>(null);
  const isDrawing = useRef(false);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const [isEraser, setIsEraser] = useState(false); // State for eraser

  // Connect to the socket server
  useEffect(() => {
    socket.current = io("https://belly-cashiers-eh-does.trycloudflare.com", {
      transports: ["websocket"],
    });

    const canvas = canvasRef.current;
    if (canvas) {
      ctx.current = canvas.getContext("2d");
      if (ctx.current) {
        ctx.current.lineWidth = 1;
        ctx.current.strokeStyle = "black";

        // Listen for draw events from the server
        socket.current.on(
          "draw",
          (data: {
            x: number;
            y: number;
            isDrawing: boolean;
            isEraser: boolean;
          }) => {
            const { x, y, isDrawing, isEraser } = data;

            if (ctx.current) {
              ctx.current.strokeStyle = isEraser ? "white" : "black"; // Set color based on eraser state
              if (isDrawing) {
                if (lastPosition.current) {
                  ctx.current.moveTo(
                    lastPosition.current.x,
                    lastPosition.current.y
                  );
                } else {
                  ctx.current.moveTo(x, y);
                }
                ctx.current.lineTo(x, y);
                ctx.current.stroke();
                lastPosition.current = { x, y };
              } else {
                ctx.current.closePath();
                lastPosition.current = null;
              }
            }
          }
        );
      }
    }

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const drawOnCanvas = (event: MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (ctx.current && isDrawing.current) {
      ctx.current.lineWidth = isEraser ? 5 : 1;
      ctx.current.strokeStyle = isEraser ? "white" : "black"; // Use white for eraser
      ctx.current.lineTo(x, y);
      ctx.current.stroke();
      lastPosition.current = { x, y };

      // Emit drawing data including isEraser state
      socket.current?.emit("draw", { x, y, isDrawing: true, isEraser });
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      isDrawing.current = true;
      ctx.current?.beginPath();
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      ctx.current?.moveTo(x, y);
      lastPosition.current = { x, y };
      drawOnCanvas(event.nativeEvent);
      canvas.addEventListener("mousemove", drawOnCanvas);
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas && ctx.current) {
      isDrawing.current = false;
      canvas.removeEventListener("mousemove", drawOnCanvas);
      ctx.current.closePath();
      socket.current?.emit("draw", { isDrawing: false, isEraser });
      lastPosition.current = null;
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (ctx.current && canvas) {
      ctx.current.clearRect(0, 0, canvas.width, canvas.height);
      socket.current?.emit("reset"); // Notify others to reset
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <button
          onClick={() => setIsEraser(false)}
          className={`px-4 py-2 rounded-lg text-2xl ${
            !isEraser ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          ✏️
        </button>
        <button
          onClick={() => setIsEraser(true)}
          className={`py-2 px-4 rounded-lg text-2xl ${
            isEraser ? "bg-red-500 text-white" : "bg-gray-300"
          }`}
        >
          🧼
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-500 m-2 bg-white rounded-lg"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        width={500}
        height={500}
      />
      <button
        onClick={resetCanvas}
        className="bg-custom-gradient py-2 px-4 rounded-lg hover:text-white"
      >
        Reset
      </button>
    </div>
  );
};

export default CanvasComponent;
