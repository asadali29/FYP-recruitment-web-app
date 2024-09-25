import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import fs from "fs";
// import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // plugins: [react(), nodePolyfills()],
  optimizeDeps: {
    esbuildOptions: {
      // Define global object
      define: {
        global: "globalThis",
        Buffer: "buffer.Buffer", // Ensure Buffer is available
        util: "util",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
          // events: true,
          util: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
      // events: "events",
      util: "util/",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
    // host: true,
    // https: {
    //   key: fs.readFileSync("./hireeazeKey.key"),
    //   cert: fs.readFileSync("./hireeaze.cert"),
    // },
  },
});
