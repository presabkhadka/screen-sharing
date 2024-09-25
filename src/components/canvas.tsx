// src/CanvasComponent.tsx
import React, { useRef, useEffect } from "react";

const CanvasComponent: React.FC = () => {
  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const ctx1 = useRef<CanvasRenderingContext2D | null>(null);
  const ctx2 = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas1 = canvasRef1.current;
    const canvas2 = canvasRef2.current;
    if (canvas1 && canvas2) {
      ctx1.current = canvas1.getContext("2d");
      ctx2.current = canvas2.getContext("2d");
      //   canvas1.width = window.innerWidth / 2;
      //   canvas1.height = window.innerHeight;
      //   canvas2.width = window.innerWidth / 2;
      //   canvas2.height = window.innerHeight;
    }
  }, []);

  const sendDrawData = (data: any) => {
    // Replace with your WebRTC signaling code
    // For demonstration, we are just calling the draw function directly
    drawOnCanvas2(data);
  };

  const drawOnCanvas1 = (event: MouseEvent) => {
    const x = event.clientX - canvasRef1.current!.getBoundingClientRect().left;
    const y = event.clientY - canvasRef1.current!.getBoundingClientRect().top;
    ctx1.current?.lineTo(x, y);
    ctx1.current?.stroke();

    // Send draw data to the other canvas
    sendDrawData({ x, y });
  };

  const drawOnCanvas2 = (data: { x: number; y: number }) => {
    ctx2.current?.lineTo(data.x, data.y);
    ctx2.current?.stroke();
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef1.current;
    if (canvas) {
      ctx1.current?.beginPath();
      drawOnCanvas1(event.nativeEvent);
      canvas.addEventListener("mousemove", drawOnCanvas1);
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef1.current;
    if (canvas) {
      canvas.removeEventListener("mousemove", drawOnCanvas1);
      ctx1.current?.closePath();
    }
  };

  const resetCanvases = () => {
    const canvas1 = canvasRef1.current;
    const canvas2 = canvasRef2.current;
    if (ctx1.current && ctx2.current && canvas1 && canvas2) {
      ctx1.current.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.current.clearRect(0, 0, canvas2.width, canvas2.height);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef1}
        className="border border-gray-500 m-2 bg-white"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button
        onClick={resetCanvases}
        className="bg-custom-gradient p-2 rounded-lg hover:animate-pulse hover:text-white"
      >
        Reset
      </button>
      <canvas
        ref={canvasRef2}
        className="border border-gray-500 m-2 bg-white"
      />
    </div>
  );
};

export default CanvasComponent;
