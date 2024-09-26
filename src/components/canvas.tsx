import React, { useRef, useEffect } from "react";

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    channel.current = new BroadcastChannel("canvas-channel");

    const canvas = canvasRef.current;
    if (canvas) {
      ctx.current = canvas.getContext("2d");
      if (ctx.current) {
        ctx.current.lineWidth = 2;
        ctx.current.strokeStyle = "black";

        channel.current.onmessage = (event) => {
          const { x, y, isDrawing } = event.data;

          if (ctx.current) {
            if (isDrawing) {
              ctx.current.lineTo(x, y);
              ctx.current.stroke();
            } else {
              ctx.current.closePath();
            }
          }
        };
      }
    }

    return () => {
      channel.current?.close();
    };
  }, []);

  const drawOnCanvas = (event: MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (ctx.current && isDrawing.current) {
      ctx.current.lineTo(x, y);
      ctx.current.stroke();
      channel.current?.postMessage({ x, y, isDrawing: true });
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
      channel.current?.postMessage({ isDrawing: false });
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (ctx.current && canvas) {
      ctx.current.reset();
    }
  };

  return (
    <div className="flex flex-col items-center">
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
        className="bg-custom-gradient p-2 rounded-lg hover:animate-pulse hover:text-white"
      >
        Reset
      </button>
    </div>
  );
};

export default CanvasComponent;
