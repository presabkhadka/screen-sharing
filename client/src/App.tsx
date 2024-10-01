import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./components/landing";
import Videocall from "./components/videocall";

export default function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        { path: "/", element: <Landing /> },
        { path: "/videocall", element: <Videocall /> },
      ])}
    ></RouterProvider>
  );
}
