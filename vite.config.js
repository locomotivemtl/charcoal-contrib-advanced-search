import { defineConfig } from "vite";
import { resolve } from "path";
import viteSassDts from "vite-plugin-sass-dts";

// Helper to create both minified and non-minified outputs

import { minify } from "terser";

function dualOutputs() {
  return {
    name: "dual-outputs",
    async generateBundle(options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (
          fileName === "scripts/advanced-search.js" &&
          chunk.type === "chunk"
        ) {
          // Write non-minified version (as chunk, with map)
          // Vite already outputs this as a chunk, so keep it
          // Now emit minified version with its own map
          const minified = await minify(chunk.code, {
            sourceMap: {
              content: chunk.map,
              filename: "scripts/advanced-search.min.js",
              url: "advanced-search.min.js.map",
            },
          });

          this.emitFile({
            type: "asset",
            fileName: "scripts/advanced-search.min.js",
            source: minified.code,
          });

          if (minified.map) {
            this.emitFile({
              type: "asset",
              fileName: "scripts/advanced-search.min.js.map",
              source: minified.map,
            });
          }
        }
      }
    },
  };
}

export default defineConfig({
  root: ".",
  build: {
    outDir: "assets/dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false, // handled by plugin for .min.js
    rollupOptions: {
      input: {
        "scripts/advanced-search": resolve(
          __dirname,
          "assets/src/scripts/index.js"
        ),
        "styles/main": resolve(__dirname, "assets/src/styles/main.scss"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name.startsWith("styles/")) {
            return "[name].css";
          }
          if (chunk.name === "scripts/advanced-search") {
            return "scripts/advanced-search.js";
          }
          return "[name].js";
        },
        assetFileNames: (asset) => {
          if (asset.names && asset.names.at(-1).endsWith(".css")) {
            return "styles/charcoal.advanced-search.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
  plugins: [viteSassDts(), dualOutputs()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "assets/src"),
    },
  },
});
