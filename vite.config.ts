import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "rapid-draughts",
      fileName: "index",
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
