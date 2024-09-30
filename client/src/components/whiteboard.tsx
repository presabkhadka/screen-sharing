import { useSyncDemo } from "@tldraw/sync";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Whiteboard() {

    const store = useSyncDemo({roomId: 'teammonitor'})

  return (
    <div className="h-full w-full">
        <Tldraw store={store}/>
    </div>
  );
}
