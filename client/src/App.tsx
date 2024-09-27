import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./components/landing";

export default function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([{ path: "/", element: <Landing /> }])}
    ></RouterProvider>
  );
}
