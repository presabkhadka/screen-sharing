import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RoomProvider } from "./context/RoomContext.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Room } from "./pages/Room.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  </>
);
