import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // Ensure you're using the correct port
    strictPort: true, // Fail if the port is already in use
  },
});
