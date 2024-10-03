import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { RoomHandler } from "./room/roomHandler";

const port = 3000;
const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected to socket.");
  RoomHandler(socket)
  socket.on("disconnect", () => {
    console.log("User disconnected from socket.");
  });
});

server.listen(port, () => {
  console.log(`Listening on port, ${port}`);
});
