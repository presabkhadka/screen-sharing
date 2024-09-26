import React, { useRef, useEffect } from "react";

const CanvasComponent: React.FC = () => {
  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const ctx1 = useRef<CanvasRenderingContext2D | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channel.current = new BroadcastChannel("canvas-channel");

    const canvas1 = canvasRef1.current;
    if (canvas1) {
      ctx1.current = canvas1.getContext("2d");
    }

    channel.current.onmessage = (event) => {
      console.log("Received message:", event.data);
      const { x, y, isDrawing } = event.data;
      if (isDrawing) {
        ctx1.current?.lineTo(x, y);
        ctx1.current?.stroke();
      } else {
        ctx1.current?.closePath();
      }
    };

    // Clean up function
    return () => {
      channel.current?.close();
      channel.current = null;
    };
  }, []);

  const drawOnCanvas = (event: MouseEvent) => {
    const x = event.clientX - canvasRef1.current!.getBoundingClientRect().left;
    const y = event.clientY - canvasRef1.current!.getBoundingClientRect().top;

    if (channel.current) {
      channel.current.postMessage({ x, y, isDrawing: true });
    }

    ctx1.current?.lineTo(x, y);
    ctx1.current?.stroke();
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef1.current;
    if (canvas) {
      ctx1.current!.strokeStyle = "black";
      ctx1.current!.lineWidth = 1;
      ctx1.current?.beginPath();
      drawOnCanvas(event.nativeEvent);
      canvas.addEventListener("mousemove", drawOnCanvas);
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef1.current;
    if (canvas) {
      canvas.removeEventListener("mousemove", drawOnCanvas);
      ctx1.current?.closePath();

      if (channel.current) {
        channel.current.postMessage({ isDrawing: false });
      }
    }
  };

  const resetCanvas = () => {
    const canvas1 = canvasRef1.current;
    if (ctx1.current && canvas1) {
      ctx1.current.clearRect(0, 0, canvas1.width, canvas1.height);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef1}
        className="border border-gray-500 m-2 bg-white rounded-lg"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button
        onClick={resetCanvas}
        className="bg-custom-gradient p-2 rounded-lg hover:animate-pulse hover:text-white"
      >
        Reset
      </button>
    </div>
  );
};

export default CanvasComponent;
