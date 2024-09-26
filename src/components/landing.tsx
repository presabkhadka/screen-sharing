import CanvasComponent from "./canvas";
import Navbar from "./navbar";
import ScreenShare from "./screenShare";

export default function Landing() {
  return (
    <div className="h-screen w-screen grid grid-cols-12 gap-4 p-4 bg-custom-gradient1">
      <div className="col-span-full">
        <Navbar />
      </div>
      <div className="col-span-8">
        <ScreenShare />
      </div>
      <div className="col-span-4 flex flex-col gap-4">
        <CanvasComponent />
      </div>
    </div>
  );
}
