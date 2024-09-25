// src/PeerConnection.ts
import SimplePeer from "simple-peer;";
export class PeerConnection {
  public peer: SimplePeer.Instance;

  constructor(initiator: boolean, onData: (data: string) => void) {
    this.peer = new SimplePeer({ initiator });

    this.peer.on("signal", (data: any) => {
      // Handle signaling data (exchange this between peers)
      console.log("Signal data:", JSON.stringify(data));
    });

    this.peer.on("data", (data: any) => {
      // Handle incoming drawing data
      onData(data.toString());
    });
  }

  connect(signalData: string) {
    this.peer.signal(JSON.parse(signalData));
  }

  send(data: string) {
    this.peer.send(data);
  }
}
