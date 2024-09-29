import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

interface DrawData {
  x: number;
  y: number;
  isDrawing: boolean;
}

io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Socket ID:", socket.id);

  socket.on("register-peer-id", (peerId) => {
    console.log("Peer ID registered:", peerId);
    socket.broadcast.emit("peer-id", peerId);
  });

  socket.on("draw", (data: DrawData) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
