import React, { useRef, useState, useEffect } from "react";

const DualCanvas = () => {
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const syncedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (originalCanvasRef.current) {
      const ctx = originalCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        setContext(ctx);
      }
    }
  }, []);

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

    if (syncedCanvasRef.current) {
      const syncedCtx = syncedCanvasRef.current.getContext("2d");
      if (syncedCtx) {
        syncedCtx.strokeStyle = context.strokeStyle;
        syncedCtx.lineWidth = context.lineWidth;
        syncedCtx.lineCap = context.lineCap;
        syncedCtx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        syncedCtx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const handleReset = () => {
    if (originalCanvasRef.current && syncedCanvasRef.current) {
      const originalCtx = originalCanvasRef.current.getContext("2d");
      const syncedCtx = syncedCanvasRef.current.getContext("2d");

      if (originalCtx) {
        originalCtx.clearRect(
          0,
          0,
          originalCanvasRef.current.width,
          originalCanvasRef.current.height
        );
      }

      if (syncedCtx) {
        syncedCtx.clearRect(
          0,
          0,
          syncedCanvasRef.current.width,
          syncedCanvasRef.current.height
        );
      }
    }
  };

  return (
    <div className="flex gap-4 flex-col items-center">
      <canvas
        ref={originalCanvasRef}
        onMouseDown={drawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-black rounded-lg bg-white"
      ></canvas>
      <button
        onClick={handleReset}
        className="p-4 border bg-white rounded-lg w-fit"
      >
        s
      </button>
      <canvas
        ref={syncedCanvasRef}
        className="border border-black rounded-lg bg-white"
      ></canvas>
    </div>
  );
};

export default DualCanvas;
