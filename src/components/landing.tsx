import CanvasComponent from "./canvas";
import Videocall from "./videocall";

export default function Landing() {
  return (
    <div className="h-screen w-screen grid grid-cols-12  gap-4 p-4 bg-custom-gradient1">
      <div className="col-span-8 h-full">
        <Videocall />
      </div>
      <div className="col-span-4 flex flex-col gap-4">
        <CanvasComponent />
      </div>
    </div>
  );
}
