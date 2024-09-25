import React, { useRef, useState } from "react";

const ScreenShare: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const startScreenShare = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsSharing(true);
    } catch (err) {
      console.log(err);
    }
  };

  const stopScreenShare = () => {
    const videoElement = videoRef.current;
    const stream = videoElement?.srcObject as MediaStream;
    const tracks = stream?.getTracks();

    if (tracks) {
      tracks.forEach((track) => track.stop());
    }
    videoElement!.srcObject = null;
    setIsSharing(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        className="w-full border border-black rounded-lg bg-white"
      ></video>

      {!isSharing ? (
        <button
          onClick={startScreenShare}
          className="px-4 py-2 bg-custom-gradient rounded-lg hover:text-white hover:animate-pulse"
        >
          Start
        </button>
      ) : (
        <button
          onClick={stopScreenShare}
          className="px-4 py-2 bg-custom-gradient rounded-lg hover:text-white hover:animate-pulse"
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default ScreenShare;
