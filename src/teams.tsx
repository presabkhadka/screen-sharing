import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

const Teams: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);

  
  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        contextRef.current = context;
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2;
      }
    }
  }, []);

  
  useEffect(() => {
    const startScreenShare = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing display media.", error);
      }
    };
    startScreenShare();
  }, []);

  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setDrawing(false);
    contextRef.current?.beginPath(); 
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !contextRef.current) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    
    socket.emit("drawing", { x, y });
  };

  
  socket.on("drawing", (data: { x: number; y: number }) => {
    if (contextRef.current) {
      const { x, y } = data;
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    }
  });

  return (
    <div className="flex flex-row justify-between items-center h-screen p-4">
      <video ref={videoRef} autoPlay className="w-1/2 border border-black" />
      <canvas
        ref={canvasRef}
        className="border border-black w-1/2 h-full"
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onMouseMove={draw}
      />
    </div>
  );
};

export default Teams;
