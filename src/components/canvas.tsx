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
    }
  }, []);

  const sendDrawData = (data: any) => {
    drawOnCanvas2(data);
  };

  const drawOnCanvas1 = (event: MouseEvent) => {
    const x = event.clientX - canvasRef1.current!.getBoundingClientRect().left;
    const y = event.clientY - canvasRef1.current!.getBoundingClientRect().top;
    ctx1.current?.lineTo(x, y);
    ctx1.current?.stroke();

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
        className="border border-gray-500 m-2 bg-white rounded-lg"
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
        className="border border-gray-500 m-2 bg-white rounded-lg"
      />
    </div>
  );
};

export default CanvasComponent;
